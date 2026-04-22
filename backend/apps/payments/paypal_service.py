import requests
from django.conf import settings
from django.utils import timezone

PAYPAL_API = (
    'https://api-m.sandbox.paypal.com'
    if settings.PAYPAL_SANDBOX
    else 'https://api-m.paypal.com'
)


def _token():
    r = requests.post(
        f'{PAYPAL_API}/v1/oauth2/token',
        data={'grant_type': 'client_credentials'},
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
    )
    r.raise_for_status()
    return r.json()['access_token']


def create_paypal_order(order):
    token = _token()
    payload = {
        'intent': 'CAPTURE',
        'purchase_units': [{
            'reference_id': order.reference,
            'invoice_id':   order.reference,
            'amount': {
                'currency_code': 'EUR',
                'value': str(order.total),
            },
        }],
    }
    r = requests.post(
        f'{PAYPAL_API}/v2/checkout/orders',
        json=payload,
        headers={'Authorization': f'Bearer {token}'},
    )
    r.raise_for_status()
    data = r.json()

    order.paypal_order_id = data['id']
    order.save(update_fields=['paypal_order_id'])

    approve_url = next(lk['href'] for lk in data['links'] if lk['rel'] == 'approve')
    return {'paypal_order_id': data['id'], 'approve_url': approve_url}


def capture_paypal_order(paypal_order_id):
    token = _token()
    r = requests.post(
        f'{PAYPAL_API}/v2/checkout/orders/{paypal_order_id}/capture',
        headers={'Authorization': f'Bearer {token}'},
        json={},
    )
    r.raise_for_status()
    from apps.orders.models import Order
    Order.objects.filter(paypal_order_id=paypal_order_id, status='pending').update(
        status  = 'paid',
        paid_at = timezone.now(),
    )
