import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class PromoCode(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percent', 'Pourcentage'),
        ('fixed',   'Montant fixe'),
    ]

    code          = models.CharField(max_length=30, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES, default='percent')
    discount_value = models.DecimalField(max_digits=7, decimal_places=2)
    min_order     = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    max_uses      = models.PositiveIntegerField(null=True, blank=True)
    used_count    = models.PositiveIntegerField(default=0)
    active        = models.BooleanField(default=True)
    expires_at    = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.code

    def is_valid(self, subtotal):
        if not self.active:
            return False, 'Code promo inactif.'
        if self.expires_at and self.expires_at < timezone.now():
            return False, 'Code promo expiré.'
        if self.max_uses and self.used_count >= self.max_uses:
            return False, 'Code promo épuisé.'
        if subtotal < self.min_order:
            return False, f'Commande minimum de {self.min_order} € requise.'
        return True, None

    def compute_discount(self, subtotal):
        if self.discount_type == 'percent':
            return round(subtotal * self.discount_value / 100, 2)
        return min(self.discount_value, subtotal)


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',    'En attente'),
        ('paid',       'Paye'),
        ('processing', 'En cours'),
        ('shipped',    'Expedie'),
        ('delivered',  'Livre'),
        ('cancelled',  'Annule'),
        ('refunded',   'Rembourse'),
    ]

    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=24, unique=True)
    user      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='orders',
    )
    status    = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Client
    first_name = models.CharField(max_length=80)
    last_name  = models.CharField(max_length=80)
    email      = models.EmailField()
    phone      = models.CharField(max_length=20, blank=True)

    # Livraison
    address   = models.CharField(max_length=255)
    city      = models.CharField(max_length=100)
    zip_code  = models.CharField(max_length=20)
    country   = models.CharField(max_length=2, default='FR')

    # Montants
    subtotal      = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=7,  decimal_places=2, default=0)
    discount      = models.DecimalField(max_digits=9,  decimal_places=2, default=0)
    total         = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code    = models.CharField(max_length=30, blank=True)

    # Paiement
    payment_method           = models.CharField(max_length=20, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True)
    paypal_order_id          = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference} — {self.get_status_display()}"


class OrderItem(models.Model):
    order        = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_slug = models.SlugField()
    product_name = models.CharField(max_length=160)
    unit_price   = models.DecimalField(max_digits=9, decimal_places=2)
    quantity     = models.PositiveSmallIntegerField(default=1)

    @property
    def line_total(self):
        return self.unit_price * self.quantity
