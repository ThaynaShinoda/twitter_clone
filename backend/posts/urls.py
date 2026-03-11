from django.urls import path

from .views import PostCreateView, FeedView, PostDetailView, LikeView, CommentListCreateView, CommentDeleteView

urlpatterns = [
    path('posts/', PostCreateView.as_view(), name='posts'),
    path('feed/', FeedView.as_view(), name='feed'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', LikeView.as_view(), name='like'),
    path('posts/<int:pk>/comments/', CommentListCreateView.as_view(), name='comments'),
    path('posts/<int:pk>/comments/<int:comment_pk>/', CommentDeleteView.as_view(), name='comment-delete'),
]