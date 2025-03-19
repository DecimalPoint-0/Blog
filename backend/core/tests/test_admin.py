from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import Client


class AdminSiteTest(TestCase):
    """Test cases for django admin dashboard or site"""

    def setUp(self):
        """Helper function to create user and client"""
        # initialize client
        self.client = Client()

        # create a super admin
        self.admin_user = get_user_model().objects.create_superuser(
            email='admin@example.com',
            password='testpass123',
            username='admin'   
        )

        # login the created admin
        self.client.force_login(self.admin_user)

        # create a user in the system
        self.user = get_user_model().objects.create_user(
            email='user@example.com',
            password='testpass123',
            username='user'
        )
    
    def test_users_list(self):
        """Test that users are listed on page."""
        url = reverse('admin:core_user_changelist')
        res = self.client.get(url)

        self.assertContains(res, self.user.username)

    def test_edit_user_page(self):
        """Test the edit user page works."""
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_admin_user_add(self):
        """Test add user"""
        url = reverse('admin:core_user_add')
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

