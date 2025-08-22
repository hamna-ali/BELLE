from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, ProfileView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),  # POST - create new user
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # POST - get JWT tokens
    
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # POST - refresh access token
    path("profile/", ProfileView.as_view(), name="profile"),  # GET - user profile
]
