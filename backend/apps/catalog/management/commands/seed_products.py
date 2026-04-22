from django.core.management.base import BaseCommand
from apps.catalog.models import Category, Product


CATEGORIES = [
    {'slug': 'panneaux',   'name': 'Panneaux',   'order': 1},
    {'slug': 'luminaires', 'name': 'Luminaires', 'order': 2},
    {'slug': 'medaillons', 'name': 'Medaillons', 'order': 3},
]

PRODUCTS = [
    {
        'slug': 'panneau-iris-lorrain',
        'name': 'Panneau « Iris Lorrain »',
        'category_slug': 'panneaux',
        'price': '1280.00',
        'short_description': "Panneau décoratif inspiré de l'École de Nancy, iris stylisés en verres antiques soufflés.",
        'description': (
            "Cette pièce unique reprend les motifs floraux emblématiques de l'École de Nancy. "
            "Les verres antiques soufflés à la bouche laissent passer la lumière en nuances profondes, "
            "soutenu par un sertissage plomb patiné à la main. "
            "Idéal pour une fenêtre de séjour ou un claustra intérieur."
        ),
        'dimensions': '60 × 80 cm',
        'materials': ['Verre antique soufflé', 'Plomb patiné', 'Soudure étain'],
        'lead_time': '3 à 4 semaines',
        'colors': ['#1f4e3d', '#c97b5a', '#d9b382', '#faf6ef'],
        'badge': 'Pièce unique',
        'in_stock': True,
        'featured': True,
    },
    {
        'slug': 'lampe-tiffany-automne',
        'name': 'Lampe Tiffany « Automne »',
        'category_slug': 'luminaires',
        'price': '690.00',
        'short_description': "Lampe de table en technique Tiffany, camaraï ambreé et émeraude, lumière chaude.",
        'description': (
            "Abat-jour composé de plus de 180 pièces de verre cathédrale assemblées au ruban de cuivre. "
            "Pied en laiton patiné, douille E14. "
            "Diffuse une lumière chaude, idéale en chevet ou sur un bureau."
        ),
        'dimensions': 'Ø 28 × H 42 cm',
        'materials': ['Verre cathédrale', 'Ruban de cuivre', 'Laiton patiné'],
        'lead_time': '2 à 3 semaines',
        'colors': ['#a05438', '#1f4e3d', '#d9b382'],
        'badge': 'Best-seller',
        'in_stock': True,
        'featured': True,
    },
    {
        'slug': 'medaillon-soleil-couchant',
        'name': 'Médaillon « Soleil couchant »',
        'category_slug': 'medaillons',
        'price': '320.00',
        'short_description': "Médaillon rond à suspendre, rayons ambrés sur fond émeraude, finition plomb étiré.",
        'description': (
            "Petit médaillon de 30 cm de diamètre, livré avec chaînette en laiton pour suspension "
            "devant une fenêtre. Les rayons en verre ambré irisé captent la lumière du matin avec des reflets chatoyants."
        ),
        'dimensions': 'Ø 30 cm',
        'materials': ['Verre irisé', 'Plomb étiré', 'Chaînette laiton'],
        'lead_time': '1 à 2 semaines',
        'colors': ['#c97b5a', '#d9b382', '#1f4e3d'],
        'badge': '',
        'in_stock': True,
        'featured': True,
    },
    {
        'slug': 'suspension-feuillage',
        'name': 'Suspension « Feuillage »',
        'category_slug': 'luminaires',
        'price': '940.00',
        'short_description': "Suspension sphérique, feuilles de vigne en verre cathédrale vert, monture laiton.",
        'description': (
            "Suspension composée de 72 feuilles découpées et cuivrées individuellement, puis soudées à l'étain. "
            "L'ensemble diffuse une lumière tamisée rappelant la sous-bois. "
            "Livré avec 1,5 m de câble textile noir."
        ),
        'dimensions': 'Ø 40 × H 38 cm',
        'materials': ['Verre cathédrale', 'Ruban de cuivre', 'Laiton'],
        'lead_time': '3 à 4 semaines',
        'colors': ['#1f4e3d', '#2f6e57', '#6fa593'],
        'badge': 'Sur commande',
        'in_stock': False,
        'featured': False,
    },
]


class Command(BaseCommand):
    help = 'Initialise les categories et produits depuis les donnees du front'

    def handle(self, *args, **options):
        for cat_data in CATEGORIES:
            cat, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'order': cat_data['order']},
            )
            self.stdout.write(f"  {'Cree' if created else 'Existant'} : {cat.name}")

        for p in PRODUCTS:
            cat = Category.objects.get(slug=p.pop('category_slug'))
            prod, created = Product.objects.update_or_create(
                slug=p['slug'],
                defaults={**{k: v for k, v in p.items() if k != 'slug'}, 'category': cat},
            )
            self.stdout.write(f"  {'Cree' if created else 'MAJ'} : {prod.name}")

        self.stdout.write(self.style.SUCCESS('Seed termine !'))
