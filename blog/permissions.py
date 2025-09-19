# blog/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "author_id", None) == request.user.id


class IsCommentOwnerOrPostOwner(BasePermission):
    """
    Read: everyone.
    Write: comment author or blog post author.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return obj.author_id == user.id or getattr(obj.post, "author_id", None) == user.id