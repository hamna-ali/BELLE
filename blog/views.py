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

from blog import serializers


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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        post_id = self.request.query_params.get("post")
        if post_id:
            qs = qs.filter(post_id=post_id)
            top = self.request.query_params.get("top_level")
            if top in ("1", "true", "True"):
                qs = qs.filter(parent__isnull=True)
        return qs


    def perform_create(self, serializer):
        parent_id = self.request.data.get("parent")
        post_id = self.request.data.get("post")

        if parent_id:
            try:
                parent = Comment.objects.get(id=parent_id)
                serializer.save(author=self.request.user, parent=parent, post=parent.post)
                return
            except Comment.DoesNotExist:
                raise serializers.ValidationError({"parent": "Invalid parent ID."})

        if post_id:
            serializer.save(author=self.request.user, post_id=post_id)
        else:
            raise serializers.ValidationError({"post": "This field is required."})


import os
from openai import OpenAI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from django.utils import timezone
from django.contrib.auth.decorators import login_required

# ==================== ENHANCED AI VIEWS ====================
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
@method_decorator(csrf_exempt, name="dispatch")
class GPTAutocompleteView(View):
    """Enhanced keyboard suggestions for blog post creation"""
    def post(self, request):
        try:
            data = json.loads(request.body)
            prompt = data.get("prompt", "")
            context_type = data.get("context", "general")
            
            if not prompt.strip():
                return JsonResponse({"error": "Prompt cannot be empty", "success": False}, status=400)
            
            # Customize system message based on context
            if context_type == "title":
                system_msg = "You are a helpful writing assistant for blog titles. Suggest creative, engaging title completions for beauty and lifestyle blogs. Keep suggestions under 10 words."
            elif context_type == "content":
                system_msg = "You are a helpful writing assistant for blog content. Provide natural, flowing text continuations that match the writing style. Keep responses under 50 words."
            else:
                system_msg = "You are a helpful writing assistant for blogs. Provide contextual suggestions to complete the user's thought. Keep responses concise and natural."

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": f"Continue this {context_type}: {prompt}"},
                ],
                max_tokens=60,
                temperature=0.7,
            )

            suggestion = response.choices[0].message.content.strip()
            return JsonResponse({"suggestion": suggestion, "success": True})

        except Exception as e:
            print(f"GPT Autocomplete Error: {e}")  # For debugging
            return JsonResponse({"error": str(e), "success": False}, status=500)

@method_decorator(csrf_exempt, name="dispatch") 
class ChatbotView(View):  # ✅ Remove LoginRequiredMixin
    """Main AI chatbot for user interaction"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            message = data.get("message", "")
            conversation_history = data.get("history", [])
            
            if not message.strip():
                return JsonResponse({"error": "Message cannot be empty", "success": False}, status=400)

            # Build conversation context
            messages = [
                {
                    "role": "system", 
                    "content": "You are BELLE AI, a helpful assistant for a beauty and lifestyle blogging platform called BELLE. Help users with:\n- Writing tips and content ideas for beauty blogs\n- Platform navigation and features\n- Beauty and lifestyle advice\n- General questions about makeup, skincare, hair, and dressing\n\nBe friendly, knowledgeable, and concise. Keep responses under 150 words unless specifically asked for detailed information."
                }
            ]
            
            # Add conversation history (last 8 messages to maintain context)
            for msg in conversation_history[-8:]:
                if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                    messages.append({"role": msg["role"], "content": msg["content"]})
            
            messages.append({"role": "user", "content": message})

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=200,
                temperature=0.8,
            )

            ai_response = response.choices[0].message.content.strip()
            
            return JsonResponse({
                "response": ai_response,
                "success": True,
                "timestamp": timezone.now().isoformat()
            })

        except Exception as e:
            print(f"Chatbot Error: {e}")  # For debugging
            return JsonResponse({
                "error": "I'm having trouble processing your request. Please try again.", 
                "success": False
            }, status=500)

@method_decorator(csrf_exempt, name="dispatch")
class ContentIdeasView(View):  # ✅ Remove LoginRequiredMixin
    """Generate content ideas for blog posts"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            category = data.get("category", "beauty")
            tone = data.get("tone", "casual")
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": f"Generate 5 creative blog post ideas for {category} content with a {tone} tone. Format as a simple numbered list. Focus on beauty, makeup, skincare, hair care, and fashion topics."
                    },
                    {
                        "role": "user", 
                        "content": f"Give me trending blog post ideas for {category} with {tone} tone"
                    }
                ],
                max_tokens=150,
                temperature=0.9,
            )

            ideas = response.choices[0].message.content.strip()
            return JsonResponse({"ideas": ideas, "success": True})

        except Exception as e:
            print(f"Content Ideas Error: {e}")  # For debugging
            return JsonResponse({"error": str(e), "success": False}, status=500)

@method_decorator(csrf_exempt, name="dispatch")
class WritingTipsView(View):
    """Get writing tips for blog improvement"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            blog_type = data.get("type", "general")
            
            # Predefined tips based on blog type
            tips_map = {
                "makeup": [
                    "Start with your skin prep routine",
                    "Include before/after photos",
                    "Mention specific product names and shades",
                    "Add step-by-step application tips",
                    "Include lighting and photography tips"
                ],
                "skincare": [
                    "Always mention skin types for each product",
                    "Include ingredient explanations",
                    "Add patch testing reminders",
                    "Share your skin journey story",
                    "Include morning vs evening routines"
                ],
                "hair": [
                    "Specify hair type and texture",
                    "Include heat protection reminders",
                    "Add styling time estimates",
                    "Mention weather considerations",
                    "Include product application amounts"
                ],
                "fashion": [
                    "Include body type styling tips",
                    "Add occasion-appropriate suggestions",
                    "Mention fabric care instructions",
                    "Include budget-friendly alternatives",
                    "Add seasonal styling variations"
                ],
                "general": [
                    "Start with a compelling hook",
                    "Use personal stories and experiences",
                    "Include high-quality images",
                    "Write in a conversational tone",
                    "End with a call-to-action",
                    "Optimize for SEO with relevant keywords"
                ]
            }
            
            tips = tips_map.get(blog_type, tips_map["general"])
            formatted_tips = "\n".join([f"• {tip}" for tip in tips])
            
            return JsonResponse({
                "tips": formatted_tips,
                "type": blog_type,
                "success": True
            })

        except Exception as e:
            print(f"Writing Tips Error: {e}")  # For debugging
            return JsonResponse({"error": str(e), "success": False}, status=500)

@method_decorator(csrf_exempt, name="dispatch")
class SEOSuggestionsView(View):  # ✅ Remove LoginRequiredMixin
    """Generate SEO suggestions for blog posts"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            title = data.get("title", "")
            content = data.get("content", "")
            category = data.get("category", "beauty")
            
            if not title.strip():
                return JsonResponse({"error": "Title is required", "success": False}, status=400)
            
            prompt = f"Analyze this blog post and provide SEO suggestions:\nTitle: {title}\nCategory: {category}\nContent: {content[:200]}..."
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an SEO expert for beauty and lifestyle blogs. Provide specific, actionable SEO suggestions including keywords, meta descriptions, and content improvements."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7,
            )

            suggestions = response.choices[0].message.content.strip()
            return JsonResponse({"suggestions": suggestions, "success": True})

        except Exception as e:
            print(f"SEO Suggestions Error: {e}")  # For debugging
            return JsonResponse({"error": str(e), "success": False}, status=500)