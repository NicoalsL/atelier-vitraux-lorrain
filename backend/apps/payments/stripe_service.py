import stripe
from django.conf import settings
from django.utils import timezone

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_payment_intent(order):
    intent = stripe.PaymentIntent.create(
        amount   = int(order.total * 100),
        currency = 'eur',
        metadata = {
            'order_id':        str(order.id),
            'order_reference': order.reference,
        },
    )
    order.stripe_payment_intent_id = intent.id
    order.save(update_fields=['stripe_payment_intent_id'])
    return {
        'client_secret':    intent.client_secret,
        'publishable_key':  settings.STRIPE_PUBLISHABLE_KEY,
    }


def handle_webhook(payload, sig_header):
    event = stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    )
    if event['type'] == 'payment_intent.succeeded':
        _mark_paid(event['data']['object']['metadata']['order_id'])


def _mark_paid(order_id):
    from apps.orders.models import Order
    Order.objects.filter(id=order_id, status='pending').update(
        status  = 'paid',
        paid_at = timezone.now(),
    )
