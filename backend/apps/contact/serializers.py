from rest_framework import serializers


class ContactMessageSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=80)
    last_name  = serializers.CharField(max_length=80)
    email      = serializers.EmailField()
    phone      = serializers.CharField(max_length=20, allow_blank=True, default='')
    subject    = serializers.CharField(max_length=200)
    message    = serializers.CharField()
