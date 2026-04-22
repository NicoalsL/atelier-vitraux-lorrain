from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category', 'price', 'in_stock', 'featured', 'badge']
    list_filter    = ['category', 'in_stock', 'featured']
    search_fields  = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines        = [ProductImageInline]
