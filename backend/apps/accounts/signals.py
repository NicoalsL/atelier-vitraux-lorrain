from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    if not created:
        return
    try:
        send_mail(
            subject='Bienvenue chez Atelier Vitraux Lorrain',
            message=(
                f"Bonjour {instance.first_name or instance.email},\n\n"
                "Votre compte a bien été créé. Vous pouvez maintenant passer commande, "
                "suivre vos achats et gérer vos favoris depuis votre espace personnel.\n\n"
                "À bientôt,\n"
                "L'équipe Atelier Vitraux Lorrain\n"
                "contact@vitraux-lorrain.fr"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=True,
        )
    except Exception:
        pass
