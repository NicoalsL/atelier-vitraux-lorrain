from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model  = OrderItem
    extra  = 0
    readonly_fields = ['line_total']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display   = ['reference', 'status', 'first_name', 'last_name', 'total', 'created_at']
    list_filter    = ['status', 'payment_method', 'created_at']
    search_fields  = ['reference', 'email', 'first_name', 'last_name']
    readonly_fields = ['id', 'reference', 'created_at', 'updated_at', 'paid_at']
    inlines        = [OrderItemInline]
