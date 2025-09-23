# blog/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, 
    BlogPostViewSet, 
    CommentViewSet,
    GPTAutocompleteView,
    ChatbotView,
    ContentIdeasView,
    WritingTipsView,
    SEOSuggestionsView
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"blogs", BlogPostViewSet, basename="blog")
router.register(r"comments", CommentViewSet, basename="comment")

ai_patterns = [
    path('ai/autocomplete/', GPTAutocompleteView.as_view(), name='ai-autocomplete'),
    path('ai/chatbot/', ChatbotView.as_view(), name='ai-chatbot'),
    path('ai/content-ideas/', ContentIdeasView.as_view(), name='ai-content-ideas'),
    path('ai/writing-tips/', WritingTipsView.as_view(), name='ai-writing-tips'),
    path('ai/seo-suggestions/', SEOSuggestionsView.as_view(), name='ai-seo-suggestions'),
]

urlpatterns = [
    path('', include(router.urls)),
] + ai_patterns
