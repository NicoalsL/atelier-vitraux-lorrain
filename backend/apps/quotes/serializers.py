from rest_framework import serializers
from .models import QuoteRequest


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuoteRequest
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'project_type', 'dimensions', 'budget', 'description',
            'timeline', 'reference_images', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
