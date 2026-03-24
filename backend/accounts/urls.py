from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterView, ChangePasswordView, UserProfileView, FollowUserView, FollowerListView, FollowingListView, UserListView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name="user-list"),
    path('users/<int:pk>/follow/', FollowUserView.as_view(), name='follow-user'),
    path('users/<int:pk>/followers/', FollowerListView.as_view(), name='follower-list'),
    path('users/<int:pk>/following/', FollowingListView.as_view(), name='following-list'),
]
