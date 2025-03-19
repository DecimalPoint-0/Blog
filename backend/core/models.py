from django.db import models
from django.contrib.auth.models import (
    AbstractUser,
    PermissionsMixin,
    BaseUserManager
)

import uuid
from django.conf import settings
from shortuuid.django_fields import ShortUUIDField
import shortuuid
from django.db.models.signals import post_save
from django.utils.text import slugify
from django.core.exceptions import ValidationError


def validate_image(image):
    file_size = image.file.size
    limit_kb = 500  # 500KB size limit, adjust accordingly
    if file_size > limit_kb * 1024:
        raise ValidationError(f"Max file size is {limit_kb}KB")


class User(AbstractUser):
    """Base User in the system"""
    id = models.UUIDField(default=uuid.uuid4, unique=True,
          primary_key=True, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(unique=True, max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        """returns object"""
        return self.username
    
    def create_user(self, email, password, **extra_fields):
        """Validate, Create, Store and Return New User"""
        if not email:
            raise ValueError('Cannot create a user without an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user


    class Meta:
        verbose_name_plural = 'User'


class Profile(models.Model):
    """Model for profile creation"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to='profile', default='profile/default.jpg', 
                             null=True, blank=True, validators=[validate_image])
    full_name = models.CharField(max_length=255, null=True, blank=True)
    bio = models.CharField(max_length=200, null=True, blank=True)
    author = models.BooleanField(default=False)
    facebook = models.CharField(max_length=200, null=True, blank=True)
    twitter = models.CharField(max_length=200, null=True, blank=True)
    instagram = models.CharField(max_length=200, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.user.username

    class Meta:
        verbose_name_plural = 'Profile'

# signals starts here
def create_user_profile(sender, instance, created, **kwargs):
    """signal for creating profile on user create"""
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    """signal for saving profile on user save"""
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
# signal ends here


class Category(models.Model):
    """Category of Post"""
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    image = models.FileField(upload_to='category', null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """overriding save method"""
        if self.slug == '' or self.slug is None:
            self.slug = slugify(self.title.lower()) 
        return super(Category, self).save(*args, **kwargs)
    
    # @property
    def post_count(self):
        return Post.objects.filter(category=self).count()
    
    class Meta:
        verbose_name_plural = 'Category'


class Post(models.Model):
    """Model of POST"""
    STATUS = (
        ('Active', 'Active'),
        ('Draft', 'Draft'),
        ('Disabled', 'Disabled')
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, 
                               blank=True, related_name='author')
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.FileField(upload_to='post', null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    status = models.CharField(choices=STATUS, max_length=50, default='Draft')
    views = models.IntegerField(default=0, blank=True)
    likes = models.ManyToManyField(User, blank=True)
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    tags = models.CharField(max_length=255, null=True, blank=True)


    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.slug == '' or self.slug == None:
            self.slug = slugify(self.title[0:40]) + '-' + shortuuid.uuid()[:2]
            self.status = 'Active'
        super(Post, self).save(*args, **kwargs)
 
    def author_image(self):
        profile = Profile.objects.get(user=self.author)
        profile_image = profile.image
        return profile_image
    
    def comments(self):
        return Comment.objects.filter(post=self)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Post'


class PostView(models.Model):
    """Model to track who has viewed a post"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, null=True, blank=True)  # For anonymous users
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post') 

    def __str__(self):
        if self.user is None:
            return self.post.title + ' viewed by ' + str(self.session_key)
        else:
            return self.post.title + ' viewed by ' + str(self.user.username)


class Comment(models.Model):
    """Model for creating comments"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now=True, null=True, blank=True)
    likes = models.IntegerField(default=0)
    reply = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Comment'

    def __str__(self):
        return self.post.title + " " + self.comment
    
    def commenter_image(self):
        user = Profile.objects.get(user=self.user)
        image = user.image
        return image

    

class Notification(models.Model):
    """Model for notifications"""
    NOTIFICATION_TYPE = (
        ('Like', 'Like'),
        ('Comment', 'Comment'),
        ('Reply', 'Reply'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    type = models.CharField(choices=NOTIFICATION_TYPE, max_length=30)
    date = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        if self.type == 'Like':
            return f'{self.user} Liked your post: {self.post.title}'
        elif self.type == 'Comment':
            return f'{self.user} Commented on your post: {self.post.title}'
        elif self.type == 'Reply':
            return f'{self.user} Replied to a comment on your post: {self.post.title}'

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Notification"


class Team(models.Model):
    """Model for team members"""

    full_name = models.CharField(max_length=255, null=True, blank=True)
    position = models.CharField(max_length=255, null=True, blank=True)
    image = models.FileField(upload_to='team', null=True, blank=True)

    def __str__(self):
        return self.full_name
    
    class Meta:
        verbose_name_plural = "Team"