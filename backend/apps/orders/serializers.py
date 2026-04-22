from rest_framework import serializers
from .models import Order, OrderItem, PromoCode


class OrderItemInputSerializer(serializers.Serializer):
    product_slug = serializers.SlugField()
    product_name = serializers.CharField(max_length=160)
    unit_price   = serializers.DecimalField(max_digits=9, decimal_places=2)
    quantity     = serializers.IntegerField(min_value=1, max_value=99)


class PromoCodeValidateSerializer(serializers.Serializer):
    code     = serializers.CharField(max_length=30)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)


class OrderCreateSerializer(serializers.Serializer):
    first_name     = serializers.CharField(max_length=80)
    last_name      = serializers.CharField(max_length=80)
    email          = serializers.EmailField()
    phone          = serializers.CharField(max_length=20, allow_blank=True, default='')
    address        = serializers.CharField(max_length=255)
    city           = serializers.CharField(max_length=100)
    zip_code       = serializers.CharField(max_length=20)
    country        = serializers.CharField(max_length=2, default='FR')
    payment_method = serializers.ChoiceField(choices=['stripe', 'paypal'])
    promo_code     = serializers.CharField(max_length=30, allow_blank=True, default='')
    items          = OrderItemInputSerializer(many=True)


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = ['product_slug', 'product_name', 'unit_price', 'quantity', 'line_total']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'reference', 'status', 'first_name', 'last_name',
            'email', 'phone', 'address', 'city', 'zip_code', 'country',
            'subtotal', 'shipping_cost', 'discount', 'total', 'payment_method',
            'promo_code', 'items', 'created_at', 'paid_at',
        ]
