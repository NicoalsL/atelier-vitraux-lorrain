from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, ChangePasswordView, LogoutView, AddressListCreateView, AddressDetailView

urlpatterns = [
    path('register/',        RegisterView.as_view(),         name='auth-register'),
    path('login/',           TokenObtainPairView.as_view(),  name='auth-login'),
    path('token/refresh/',   TokenRefreshView.as_view(),     name='auth-refresh'),
    path('logout/',          LogoutView.as_view(),           name='auth-logout'),
    path('profile/',         ProfileView.as_view(),          name='auth-profile'),
    path('change-password/', ChangePasswordView.as_view(),   name='auth-change-password'),
    path('addresses/',       AddressListCreateView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
]
