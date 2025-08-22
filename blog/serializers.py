# blog/serializers.py
from rest_framework import serializers
from .models import Category, BlogPost, Comment
from django.contrib.auth import get_user_model
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

User = get_user_model()

class AuthorMiniSerializer(serializers.ModelSerializer):
    # Adjust these two lines to match your profile fields if different
    public_name = serializers.SerializerMethodField(read_only=True)
    avatar_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "public_name", "avatar_url"]

    def get_public_name(self, obj):
        prof = getattr(obj, "profile", None)
        return getattr(prof, "public_name", None) or obj.username

    def get_avatar_url(self, obj):
        prof = getattr(obj, "profile", None)
        return getattr(prof, "avatar_url", None)

class CommentSerializer(serializers.ModelSerializer):
    author = AuthorMiniSerializer(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "author",         # nested author object
            "text",           # IMPORTANT: keep as 'text'
            "parent",
            "replies",
            "created_at",
        ]
        read_only_fields = ["author", "created_at", "replies"]

    def get_replies(self, obj):
        qs = obj.replies.all().order_by("created_at")
        return CommentSerializer(qs, many=True, context=self.context).data

class BlogPostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    category = CategorySerializer(read_only=True)
    category_slug = serializers.SlugField(source="category.slug", read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "image_url", "category", "category_slug",
            "author_username", "likes_count", "is_liked", "created_at"
        ]

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.like.filter(user=user).exists()  # use correct related_name
        return False

class BlogPostDetailSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    is_liked = serializers.SerializerMethodField()  # already defined
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "content", "image_url",
            "category", "author", "author_username",
            "likes_count", "is_liked",
            "created_at", "updated_at",
            "comments",
        ]
        read_only_fields = [
            "author", "slug", "created_at", "updated_at", "likes_count", "is_liked"
        ]

    # ✅ Add this method
    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.like.filter(user=user).exists()  # ✅ filter by user
        return False

