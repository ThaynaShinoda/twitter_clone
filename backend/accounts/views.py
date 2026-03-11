from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Follow
from .serializers import RegisterSerializer, ChangePasswordSerializer, UserProfileSerializer, UpdateProfileSerializer, FollowUserSerializer


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request):
        serializer = ChangePasswordSerializer(
            instance=request.user,
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'detail': 'Senha alterada com sucesso.'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileSerializer
        return UpdateProfileSerializer
    

class FollowUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)

        if request.user == user:
            return Response({'detail': 'Você não pode seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = Follow.objects.get_or_create(follower=request.user, following=user)

        if not created:
            follow.delete()
            return Response({'detail': 'Deixou de seguir.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Seguindo'}, status=status.HTTP_201_CREATED)

class FollowerListView(generics.ListAPIView):
    serializer_class = FollowUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return User.objects.filter(following__following=pk)


class FollowingListView(generics.ListAPIView):
    serializer_class = FollowUserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        return User.objects.filter(followers__following=pk)