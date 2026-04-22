from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import ContactMessageSerializer


class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        subject = f"[Contact] {d['subject']} — {d['first_name']} {d['last_name']}"
        body = (
            f"Nom : {d['first_name']} {d['last_name']}\n"
            f"Email : {d['email']}\n"
            f"Tel : {d['phone'] or 'non renseigne'}\n\n"
            f"{d['message']}"
        )
        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )
        except Exception:
            pass

        return Response({'sent': True})
