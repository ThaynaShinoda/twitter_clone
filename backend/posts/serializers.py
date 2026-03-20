from rest_framework import serializers
from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    avatar = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user_id', 'username', 'avatar', 'content', 'created_at','updated_at', 'likes_count', 'comments_count', 'is_liked')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_avatar(self, obj):
        request = self.context.get("request")
        if not obj.user.avatar:
            return None
        avatar_url = obj.user.avatar.url
        return request.build_absolute_uri(avatar_url) if request else avatar_url

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ("id", "user_id", "username", "avatar", "content", "created_at")
        read_only_fields = ("id", "created_at")

    def get_avatar(self, obj):
        request = self.context.get("request")
        if not obj.user.avatar:
            return None
        avatar_url = obj.user.avatar.url
        return request.build_absolute_uri(avatar_url) if request else avatar_url
