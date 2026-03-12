from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient


class RegisterTest(TestCase):

    def setUp(self):
        self.client = APIClient()
    
    def test_register_with_valid_data(self):
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('register')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_register_with_duplicate_email(self):
        User = get_user_model()
        User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('register')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)

class LoginTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')

    def test_login_with_valid_credentials(self):
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
    
    def test_login_with_wrong_password(self):
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'senhaerrada'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)
        

class ProfileTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_get_profile_authenticated(self):
        url = reverse('profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_get_profile_unauthenticated(self):
        client_sem_auth = APIClient()
        url = reverse('profile')
        response = client_sem_auth.get(url)
        self.assertEqual(response.status_code, 401)


class FollowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        self.client2 = APIClient()
        self.user2 = User.objects.create_user(email='teste2@gmail.com', username='teste2', password='2teste1234')
        data = {'email':'teste2@gmail.com', 'username': 'teste2', 'password': '2teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client2.post(url, data, format='json')
        token2 = response.data['access']
        self.client2.credentials(HTTP_AUTHORIZATION='Bearer ' + token2)

    def test_follow_user(self):
        url = reverse('follow-user', kwargs={'pk':self.user2.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 201)

    def test_unfollow_user(self):
        url = reverse('follow-user', kwargs={'pk':self.user2.pk})
        response = self.client.post(url)
        response2 = self.client.post(url)
        self.assertEqual(response2.status_code, 200)

    def test_follow_yourself(self):
        url = reverse('follow-user', kwargs={'pk':self.user.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 400)
