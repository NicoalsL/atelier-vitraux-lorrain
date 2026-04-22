from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    slug  = models.SlugField(unique=True)
    name  = models.CharField(max_length=100)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Product(models.Model):
    slug              = models.SlugField(unique=True)
    name              = models.CharField(max_length=160)
    category          = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    price             = models.DecimalField(max_digits=9, decimal_places=2)
    short_description = models.CharField(max_length=280)
    description       = models.TextField()
    dimensions        = models.CharField(max_length=80, blank=True)
    materials         = models.JSONField(default=list)
    lead_time         = models.CharField(max_length=80, blank=True)
    colors            = models.JSONField(default=list)
    badge             = models.CharField(max_length=40, blank=True)
    in_stock          = models.BooleanField(default=True)
    stock             = models.PositiveIntegerField(default=0)
    featured          = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Review(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating     = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title      = models.CharField(max_length=120, blank=True)
    body       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.product.name} ({self.rating}★)"


class ProductImage(models.Model):
    product  = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image    = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    order    = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']
