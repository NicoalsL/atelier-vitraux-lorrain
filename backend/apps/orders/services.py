import uuid
from datetime import date
from django.db import transaction
from .models import Order, OrderItem, PromoCode

SHIPPING_THRESHOLD = 200
SHIPPING_COST      = 15


def _generate_reference():
    today = date.today().strftime('%Y%m%d')
    short = str(uuid.uuid4()).upper()[:6]
    return f"AVL-{today}-{short}"


@transaction.atomic
def create_order(validated_data, user=None):
    items_data = validated_data.pop('items')
    promo_code_str = validated_data.pop('promo_code', '').upper()

    subtotal      = sum(item['unit_price'] * item['quantity'] for item in items_data)
    shipping_cost = 0 if subtotal >= SHIPPING_THRESHOLD else SHIPPING_COST
    discount      = 0

    promo = None
    if promo_code_str:
        try:
            promo = PromoCode.objects.get(code=promo_code_str, active=True)
            valid, _ = promo.is_valid(subtotal)
            if valid:
                discount = promo.compute_discount(subtotal)
        except PromoCode.DoesNotExist:
            pass

    total = subtotal + shipping_cost - discount

    order = Order.objects.create(
        **validated_data,
        user          = user,
        reference     = _generate_reference(),
        subtotal      = subtotal,
        shipping_cost = shipping_cost,
        discount      = discount,
        total         = total,
        promo_code    = promo_code_str if promo else '',
    )

    OrderItem.objects.bulk_create([
        OrderItem(order=order, **item)
        for item in items_data
    ])

    if promo:
        PromoCode.objects.filter(pk=promo.pk).update(used_count=promo.used_count + 1)

    return order
