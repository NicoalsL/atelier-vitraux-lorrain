from django.urls import path
from .views import (
    StripeIntentView, StripeWebhookView,
    PaypalOrderView, PaypalCaptureView, PaypalWebhookView,
)

urlpatterns = [
    path('stripe/intent/',   StripeIntentView.as_view(),  name='stripe-intent'),
    path('stripe/webhook/',  StripeWebhookView.as_view(), name='stripe-webhook'),
    path('paypal/order/',    PaypalOrderView.as_view(),   name='paypal-order'),
    path('paypal/capture/',  PaypalCaptureView.as_view(), name='paypal-capture'),
    path('paypal/webhook/',  PaypalWebhookView.as_view(), name='paypal-webhook'),
]
