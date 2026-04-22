from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    @property
    def loyalty_points(self):
        from django.db.models import Sum
        total = self.orders.filter(status__in=['paid', 'processing', 'shipped', 'delivered']).aggregate(s=Sum('total'))['s'] or 0
        return int(total * 10)


class Address(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label      = models.CharField(max_length=60, blank=True, default='')
    first_name = models.CharField(max_length=80)
    last_name  = models.CharField(max_length=80)
    address    = models.CharField(max_length=255)
    city       = models.CharField(max_length=100)
    zip_code   = models.CharField(max_length=20)
    country    = models.CharField(max_length=2, default='FR')
    phone      = models.CharField(max_length=20, blank=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_default', 'id']

    def __str__(self):
        return f"{self.first_name} {self.last_name}, {self.city}"
