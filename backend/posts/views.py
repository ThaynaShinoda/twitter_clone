from rest_framework import permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class PostCreateView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            Post.objects
            .filter(
                Q(user=self.request.user) |
                Q(user__followers__follower=self.request.user)
            )
            .distinct()
            .order_by('-created_at')
        )


class MyPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user).order_by('-created_at')


class PostDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsAuthorOrReadOnly)
    queryset = Post.objects.all()


class LikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)

        like, created = Like.objects.get_or_create(
            user=request.user, post=post)
        if not created:
            like.delete()
            return Response({'detail': 'Like removido.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Post curtido.'}, status=status.HTTP_201_CREATED)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['pk']).order_by('created_at')

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated, IsAuthorOrReadOnly)
    lookup_field = 'pk'
    lookup_url_kwarg = 'comment_pk'
