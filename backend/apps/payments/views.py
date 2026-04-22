import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.orders.models import Order
from apps.orders.serializers import OrderSerializer
from . import stripe_service, paypal_service


class StripeIntentView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'error': 'order_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        order = get_object_or_404(Order, id=order_id, status='pending')
        try:
            data = stripe_service.create_payment_intent(order)
            return Response(data)
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    def post(self, request):
        sig = request.META.get('HTTP_STRIPE_SIGNATURE', '')
        try:
            stripe_service.handle_webhook(request.body, sig)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'received': True})


class PaypalOrderView(APIView):
    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'error': 'order_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        order = get_object_or_404(Order, id=order_id, status='pending')
        try:
            return Response(paypal_service.create_paypal_order(order))
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaypalCaptureView(APIView):
    def post(self, request):
        pid = request.data.get('paypal_order_id')
        if not pid:
            return Response({'error': 'paypal_order_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            paypal_service.capture_paypal_order(pid)
            order = Order.objects.filter(paypal_order_id=pid).first()
            return Response({'status': 'paid', 'order_id': str(order.id) if order else None})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class PaypalWebhookView(APIView):
    def post(self, request):
        return Response({'received': True})
