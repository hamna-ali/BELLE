# accounts/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile
from .serializers import ProfileSerializer
from .utils import upload_to_supabase


class SignupView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(user=user)

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User created successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=201)


# class LoginView(APIView):
#     def post(self, request):
#         username_or_email = request.data.get("username")
#         password = request.data.get("password")

#         user = authenticate(username=username_or_email, password=password)
#         if not user:
#             try:
#                 username = User.objects.get(email=username_or_email).username
#                 user = authenticate(username=username, password=password)
#             except User.DoesNotExist:
#                 pass

#         if not user:
#             return Response({"error": "Invalid credentials"}, status=400)

#         login(request, user)
#         return Response({"message": "Login successful"})
class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username_or_email, password=password)

        # If user entered email instead of username
        if not user:
            try:
                username = User.objects.get(email=username_or_email).username
                user = authenticate(username=username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            return Response({"error": "Invalid credentials"}, status=400)

        # ✅ Issue JWT tokens for both normal users and superusers
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": user.is_superuser,   # ✅ extra info for frontend
            "username": user.username,
            "email": user.email,
        }, status=200)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # ✅ handles image upload

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

    def put(self, request, *args, **kwargs):
        profile = self.get_object()
        data = request.data.copy()

        # ✅ If user uploaded a new avatar
        if "avatar" in request.FILES:
            avatar_file = request.FILES["avatar"]
            file_path = f"profile-images/{request.user.username}/{avatar_file.name}"

            # ✅ utils.py now handles bytes properly
            avatar_url = upload_to_supabase(
                bucket_name="avatars", 
                file_path=file_path,              
                file_obj=avatar_file
            )

            data["avatar_url"] = avatar_url  

        serializer = self.get_serializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        """✅ Allow frontend to fetch profile"""
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)