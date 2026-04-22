"""
Commande : python manage.py purge_old_data

Supprime / anonymise les données personnelles de plus de 10 ans,
conformément à l'obligation RGPD et à l'article L123-22 du Code de commerce
(conservation comptable 10 ans).

À lancer via cron (Linux) ou Tâches planifiées (Windows) une fois par mois :
  0 3 1 * *  /chemin/venv/bin/python manage.py purge_old_data
"""

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = 'Anonymise les commandes et supprime les comptes inactifs de plus de 10 ans.'

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=365 * 10)

        # 1. Anonymiser les commandes de plus de 10 ans (garder les montants pour la compta)
        from apps.orders.models import Order
        old_orders = Order.objects.filter(created_at__lt=cutoff)
        count_orders = old_orders.update(
            first_name='[supprimé]',
            last_name='[supprimé]',
            email='supprime@anonyme.local',
            phone='',
            address='[supprimé]',
            city='[supprimé]',
            zip_code='00000',
        )
        self.stdout.write(f'  {count_orders} commandes anonymisées.')

        # 2. Supprimer les comptes sans commande récente et inactifs depuis 10 ans
        from apps.accounts.models import User
        old_users = User.objects.filter(
            date_joined__lt=cutoff,
            last_login__lt=cutoff,
            orders__isnull=True,
        ).distinct()
        count_users = old_users.count()
        old_users.delete()
        self.stdout.write(f'  {count_users} comptes inactifs supprimés.')

        self.stdout.write(self.style.SUCCESS('Purge RGPD terminée.'))
