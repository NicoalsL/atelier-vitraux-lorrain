from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Order, PromoCode
from .serializers import OrderCreateSerializer, OrderSerializer, PromoCodeValidateSerializer
from .services import create_order


class OrderCreateView(APIView):
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user  = request.user if request.user.is_authenticated else None
        order = create_order(serializer.validated_data, user=user)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        return Response(OrderSerializer(order).data)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        return Response(OrderSerializer(orders, many=True).data)


class PromoCodeValidateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PromoCodeValidateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code_str = serializer.validated_data['code'].upper()
        subtotal = serializer.validated_data['subtotal']

        try:
            promo = PromoCode.objects.get(code=code_str)
        except PromoCode.DoesNotExist:
            return Response({'detail': 'Code promo invalide.'}, status=status.HTTP_404_NOT_FOUND)

        valid, error = promo.is_valid(subtotal)
        if not valid:
            return Response({'detail': error}, status=status.HTTP_400_BAD_REQUEST)

        discount = promo.compute_discount(subtotal)
        return Response({
            'code':           promo.code,
            'discount_type':  promo.discount_type,
            'discount_value': str(promo.discount_value),
            'discount':       str(discount),
        })

