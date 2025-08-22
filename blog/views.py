# blog/views.py
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsCommentOwnerOrPostOwner

from .models import Category, BlogPost, Comment, Like
from .serializers import (
    CategorySerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    CommentSerializer,
)
from .permissions import IsOwnerOrReadOnly, IsCommentOwnerOrPostOwner
from .pagination import DefaultPagination

# <- reuse your existing util; bucket "blog-images"
from accounts.utils import upload_to_supabase


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("author", "category").all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        "category__slug": ["exact"],
        "author__id": ["exact"],
    }
    search_fields = ["title", "content", "category__name"]
    ordering_fields = ["created_at", "title"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ["list"]:
            return BlogPostListSerializer
        return BlogPostDetailSerializer
    
    def get_serializer(self, *args, **kwargs):
        """
        Pass the request context to the serializer so `get_is_liked` can access the user.
        """
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)
    
    def get_queryset(self):
        qs = super().get_queryset()

        # Friendly alias for search: ?q=term (besides DRF's ?search=term)
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(content__icontains=q) |
                Q(category__name__icontains=q)
            )

        # "My Blogs" shortcut: ?mine=true
        mine = self.request.query_params.get("mine")
        if mine in ("1", "true", "True") and self.request.user.is_authenticated:
            qs = qs.filter(author=self.request.user)

        return qs

    def perform_create(self, serializer):
        image_file = self.request.FILES.get("image")
        image_url = ""
        if image_file:
            path = f"blog_images/{self.request.user.username}/{image_file.name}"
            image_url = upload_to_supabase(bucket_name="blog_images", file_path=path, file_obj=image_file)

        serializer.save(author=self.request.user, image_url=image_url)

    def perform_update(self, serializer):
        instance = self.get_object()
        image_file = self.request.FILES.get("image")
        image_url = instance.image_url
        if image_file:
            path = f"blog_images/{self.request.user.username}/{image_file.name}"
            image_url = upload_to_supabase(bucket_name="blog_images", file_path=path, file_obj=image_file)

        serializer.save(image_url=image_url)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def toggle_like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({"liked": liked, "likes_count": post.likes.count()})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("post", "author").all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrPostOwner]
    pagination_class = DefaultPagination

    def get_queryset(self):
        qs = super().get_queryset()
        post_id = self.request.query_params.get("post")
        if post_id:
            qs = qs.filter(post_id=post_id, parent__isnull=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)