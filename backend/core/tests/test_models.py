""""Test for models"""
from decimal import Decimal
from core import models
from django.test import TestCase
from django.contrib.auth import get_user_model


class ModelTests(TestCase):
    """Tests Models"""

    def test_create_user_with_username(self):
        """Tests creating user with an username is successful"""
        username='testuser'
        email='testuser@gmail.com'
        password='testpassw123'
        user = get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password
        )

        self.assertEqual(user.username, username)
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_create_user_without_username_and_blank_username(self):
        """"""
        with self.assertRaises(TypeError):
            get_user_model().objects.create_user(
                email='testuser@example.com',
                password='testpass123'
            )
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                username='',
                email='testuser@example.com',
                password='testpass123'
            )

    def test_new_user_email_normalized(self):
        """Tests if user email is normalized"""
        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.COM', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com']
        ]
        for email, expected in sample_emails:
            username = email.split('@')[0]
            user = get_user_model().objects.create_user(username, email, 'sample123')
            self.assertEqual(user.email, expected)

    def test_new_user_password_hashed(self):
        """Tests if password was hashed correctly"""
        email = 'sample@example.com'
        password = 'sample123'
        user = get_user_model().objects.create_user(username='userexample', email=email, password=password)

        self.assertTrue(user.check_password(password))

    def test_create_new_user_without_email(self):
        """Tests if new user has no email"""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('username','', 'sample123')

    def test_create_superuser(self):
        """Test SuperUser."""
        user = get_user_model().objects.create_superuser(
            'superuser',
            "test@example.com",
            "simple123"
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_category(self):
        """Test Create Category"""
        category = models.Category.objects.create(
            title='Technology',
            description='This is tech news'
        )

        self.assertEqual(str(category), category.title)

    def test_create_post(self):
        """"Test Create Post"""

        user = get_user_model().objects.create_user(
            'testuser',
            'test@example.com',
            'testpass123'
        )

        cat = models.Category.objects.create(
            title='Technology',
            description='This is tech news'
        )

        post = models.Post.objects.create(
            author=user,
            category=cat,
            title='This another news',
            content='This is just the content',
        )

        self.assertEqual(str(post), post.title)

    
