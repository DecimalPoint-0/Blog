from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum, Count
from django.shortcuts import get_object_or_404
from django.db.models import F

# Restframework
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from datetime import datetime

# Others
import json
import random

# Custom Imports
from core import serializers as api_serializer
from core import models



class MyTokenObtainPairView(TokenObtainPairView):
    """View to generate token for users"""
    serializer_class = api_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    """View for creating users in the system"""
    serializer_class = api_serializer.RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveAPIView):
    """View for retrieving profile"""

    permission_classes = [AllowAny]
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        profile = get_object_or_404(models.Profile, id=user_id)

        return profile


class CategoryListView(generics.ListAPIView):
    """View for listing categories"""

    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return models.Category.objects.all()
    

class PostCategoryListView(generics.ListAPIView):
    """View for listing post under a category"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = models.Category.objects.get(slug=category_slug.lower())
        return models.Post.objects.filter(category=category, status='Active')


class PostView(generics.ListAPIView):
    """View for listing posts"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return models.Post.objects.filter(status='Active')
    

class PostDetailView(generics.RetrieveAPIView):
    """View for displaying a particular post"""

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        post_slug = self.kwargs['post_slug']
        post = models.Post.objects.get(slug=post_slug, status='Active')
        if self.request.user.is_authenticated:
        # Authenticated user
            if not models.PostView.objects.filter(user=self.request.user, post=post).exists():
                    # Increment the view count if the user hasn't viewed the post
                    post.views = F('views') + 1  # F() is used to avoid race conditions
                    post.save()
                    models.PostView.objects.create(user=self.request.user, post=post)
        else:
            # Handle anonymous users by using session keys
            session_key = self.request.session.session_key
            if not session_key:
                self.request.session.create()  # Create a session if none exists
                session_key = self.request.session.session_key

            if not models.PostView.objects.filter(session_key=session_key, post=post).exists():
                post.views = F('views') + 1
                post.save()
                models.PostView.objects.create(post=post, session_key=session_key)

        # Refresh the post object to reflect the new view count
        post.refresh_from_db()
        return post


class LikePostView(APIView):
    """View for when the user likes a post"""
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        )
    )

    def post(self, request):
        post_id = self.request.data['post_id']

        print(request.user)

        if request.user == 'AnonymousUser':
            return Response({'message': 'Login required'}, 
                            status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = request.user
        
        post = models.Post.objects.get(id=post_id)

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({'message': 'Post Disliked.'}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)

            models.Notification.objects.create(
                user=user,
                post=post,
                type='Like'
            )
            return Response({'message': 'Post Liked'}, status=status.HTTP_201_CREATED)


class PostCommentView(APIView):
    """View for comments related to post"""
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'comment': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )
    )
    def post(self, request):
        post_id = request.data['post_id']
        user = request.user
        comment = request.data['comment']

        post = models.Post.objects.get(id=post_id)

        # user = models.User.objects.get(id=user_id)

        models.Comment.objects.create(
            post=post,
            user=user,
            comment=comment
        )

        models.Notification.objects.create(
            user=user,
            post=post,
            type='Comment',
        )
        
        return Response({'message': 'Comment Sent'}, status=status.HTTP_201_CREATED)


class DashboardStats(generics.ListAPIView):
    """View for Author statistics """

    serializer_class = api_serializer.AuthorSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = models.User.objects.get(id=user_id)
        
        views = models.Post.objects.filter(author=user).aggregate(view = Sum('views'))['view']

        posts = models.Post.objects.filter(author=user).count()

        total_likes = models.Post.objects.filter(author=user).annotate(likes_count=Count('likes')).aggregate(total_likes=Sum('likes_count'))['total_likes'] or 0

        # likes = models.Post.objects.filter(author=user).aggregate(like = Sum('likes'))['like']


        return [{
            'views': views,
            'posts': posts,
            'likes': total_likes
        }]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return  Response(serializer.data)

class DashboardPostList(generics.ListAPIView):
    """View for Listing Posts"""
    
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Override get_queryset"""

        user_id = self.kwargs['user_id']
        user = models.User.objects.get(id=user_id)

        posts = models.Post.objects.filter(author=user).order_by('-id')

        return posts
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return  Response(serializer.data)
    

class DashboardCommentList(generics.ListAPIView):
    """"View for listing comments """

    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Override get_queryset"""
        user_id = self.kwargs['user_id']
        user = models.User.objects.get(id=user_id)

        return models.Comment.objects.filter(post__user=user)
    

class DashboardNotificationList(generics.ListAPIView):
    """"View for listing notification """

    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """Override get_queryset"""
        user_id = self.kwargs['user_id']
        user = models.User.objects.get(id=user_id)

        return models.Notification.objects.filter(status=False, user=user)
    

class DashboardMarkNofication(APIView):
    """ View for marking notification as seen """

    def post(self, request):
        noti_id = request.data['noti_id']
        noti = models.Notification.objects.get(id=noti_id)
        noti.status = True
        noti.save()
    
        return Response({'message': 'Notification marked as seen'}, 
                        status=status.HTTP_200_OK)
    

class DashboardReplyCommentApi(APIView):
    """View for replying to comments"""

    def post(self, request):
        comment_id = request.data['comment_id']
        user = request.user
        reply = request.data['reply']

        comment = models.Comment.objects.get(id=comment_id)
        comment.reply = reply
        
        comment.save()

        return Response({'message': 'Comment Response Send'}, status=status.HTTP_200_OK)
    

class DashboardCreatePostApi(generics.CreateAPIView):
    """View for creating posts"""

    def create(self, request, *args, **kwargs):
        author = request.user
        title = request.data.get('title')
        content = request.data.get('content')
        image = request.data.get('image')
        category_id = request.data.get('category_id')

        post = models.Post.objects.create(
            author=author,
            title=title,
            content=content,
            image=image,
            category=models.Category.objects.get(id=category_id)
        )


class DashboardPostEditApi(generics.RetrieveUpdateDestroyAPIView):
    """View for updating DashboardPost"""

    def get_object(self, request):
        post_id = self.kwargs['post_id']
        user = request.user

        return models.Post.objects.get(id=post_id, author=user)
    
    def update(self, request, *args, **kwargs):
        post = self.get_object(request=request)

        author = request.user
        title = request.data.get('title')
        content = request.data.get('content')
        category_id = request.data.get('category_id')
        image = request.data.get('image')
        
        category = models.Category.objects.get(id=category_id)

        if image != None:
            post.image = image
        
        post.title = title
        post.author = author
        post.content = content
        post.category = category
        post.save()

        return Response({'message': 'Post updated successfully'}, 
                        status=status.HTTP_200_OK)






    