from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ProductReviewListCreateView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products',   ProductViewSet,  basename='product')

urlpatterns = router.urls + [
    path('products/<slug:slug>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
]
