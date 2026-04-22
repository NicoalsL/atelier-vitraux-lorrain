from django.urls import path
from .views import OrderCreateView, OrderDetailView, MyOrdersView, PromoCodeValidateView

urlpatterns = [
    path('',                  OrderCreateView.as_view(),      name='order-create'),
    path('me/',               MyOrdersView.as_view(),         name='order-list-me'),
    path('promo/validate/',   PromoCodeValidateView.as_view(), name='promo-validate'),
    path('<uuid:order_id>/',  OrderDetailView.as_view(),      name='order-detail'),
]
