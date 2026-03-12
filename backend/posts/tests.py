from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient

from posts.models import Post, Comment

class PostTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email':'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        Post.objects.create(user=self.user, content='Conteúdo do post')

    def test_crete_post_authenticated(self):
        url = reverse('posts')
        data = {'content': 'Meu primeiro post'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_create_post_unauthenticated(self):
        client_sem_auth = APIClient()
        url = reverse('posts')
        data = {'content': 'Meu primeiro post'}
        response = client_sem_auth.post(url, data, format='json')
        self.assertEqual(response.status_code, 401)


class FeedTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email': 'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
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

    def test_feed_empty_when_not_following(self):
        url = reverse('feed')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_feed_shows_followed_user_posts(self):
        url = reverse('follow-user', kwargs={'pk':self.user2.pk})
        self.client.post(url)
        Post.objects.create(user=self.user2, content='Testando')
        url_feed = reverse('feed')
        response = self.client.get(url_feed)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)


class PostDetailTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email': 'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
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

        self.post = Post.objects.create(user=self.user, content='Testando')


    def test_get_post(self):
        url = reverse('post-detail', kwargs={'pk':self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_delete_post_as_author(self):
        url = reverse('post-detail', kwargs={'pk':self.post.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_delete_post_as_other_user(self):
        url = reverse('post-detail', kwargs={'pk':self.post.pk})
        response = self.client2.delete(url)
        self.assertEqual(response.status_code, 403)


class LikeTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email': 'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        self.post = Post.objects.create(user=self.user, content='Testando')

    def test_like_post(self):
        url = reverse('like', kwargs={'pk':self.post.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 201)

    def test_unlike_post(self):
        url = reverse('like', kwargs={'pk':self.post.pk})
        response = self.client.post(url)
        response2 = self.client.post(url)
        self.assertEqual(response2.status_code, 200)


class CommentTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(email='teste@gmail.com', username='teste', password='teste1234')
        data = {'email': 'teste@gmail.com', 'username': 'teste', 'password': 'teste1234'}
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

        self.post = Post.objects.create(user=self.user, content='Testando')

    def test_create_comment(self):
        url = reverse('comments',kwargs={'pk':self.post.pk})
        data = {'content': 'Meu comentário'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_list_comments(self):
        Comment.objects.create(user=self.user, post=self.post, content='Teste comentário')
        url = reverse('comments', kwargs={'pk': self.post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_delete_comment_as_other_user(self):
        comentario = Comment.objects.create(user=self.user, post=self.post, content='Teste comentário')
        url = reverse('comment-delete', kwargs={'pk':self.post.pk, 'comment_pk':comentario.pk})
        response = self.client2.delete(url)
        self.assertEqual(response.status_code, 403)
