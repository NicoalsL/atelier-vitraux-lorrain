from django.contrib import admin
from .models import QuoteRequest


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display  = ['first_name', 'last_name', 'project_type', 'budget', 'read', 'created_at']
    list_filter   = ['project_type', 'budget', 'read']
    search_fields = ['first_name', 'last_name', 'email']
    readonly_fields = ['created_at']
