from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .models import QuoteRequest
from .serializers import QuoteRequestSerializer


class QuoteRequestCreateView(CreateAPIView):
    queryset           = QuoteRequest.objects.all()
    serializer_class   = QuoteRequestSerializer
    permission_classes = [AllowAny]
