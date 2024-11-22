from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from core import models

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT token serializer"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email

        return token


class RegisterSerializer(serializers.ModelSerializer):
    """"Serializer for creating user"""
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = models.User
        fields = ['email', 'password', 'password2']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 5,
                'style': {'input_type': 'password'}
            }
        }

    def validate(self, attrs):
        if attrs['password2'] != attrs['password']:
            raise serializers.ValidationError({'Password': "Password field mismatch"})
        
        return attrs
    
    def create(self, validated_data):
        user = models.User.objects.create(
            email = validated_data['email'],
            username = validated_data['email'].split('@')[0],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for User's profile"""

    class Meta:
        model = models.Profile
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Catgories"""

    def get_post_count(self, category):
        return category.post.count()
    
    class Meta:
        model = models.Category
        fields = ['id', 'title', 'image', 'slug', 'post_count']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment"""

    commenter_image = serializers.FileField()

    class Meta:
        model = models.Comment
        fields = '__all__'
        extra_fields = ['commenter_image']
    
    def __init__(self, *args, **kwargs):
        super(CommentSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class PostSerializer(serializers.ModelSerializer):
    """Serialzer for creating Posts"""
    author_bio = serializers.ReadOnlyField(source='author.profile.bio')
    author_name = serializers.ReadOnlyField(source='author.full_name')
    category = serializers.ReadOnlyField(source='category.title')
    author_image = serializers.FileField()
    comments = CommentSerializer(many=True)

    class Meta:
        model = models.Post
        fields = '__all__'
        extra_fields = ['author_bio', 'author_name', 'category', 'author_image']
    
    def __init__(self, *args, **kwargs):
        super(PostSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notification"""

    class Meta:
        model = models.Notification
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1


class AuthorSerializer(serializers.Serializer):
    views = serializers.IntegerField(default=0)
    posts = serializers.IntegerField(default=0)
    likes = serializers.IntegerField(default=0)


class TeamSerializer(serializers.ModelSerializer):
    """Team serializer"""

    class Meta:
        model = models.Team
        fields = '__all__'

