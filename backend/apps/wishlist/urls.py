from django.urls import path
from .views import WishlistView, WishlistItemDeleteView

urlpatterns = [
    path('',                    WishlistView.as_view(),            name='wishlist'),
    path('<int:product_id>/',   WishlistItemDeleteView.as_view(),  name='wishlist-delete'),
]
