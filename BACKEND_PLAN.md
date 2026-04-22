# Backend Django — plan (à venir)

Le front est prêt à consommer une API REST Django. Voici la structure visée.

## Arborescence proposée

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── prod.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── catalog/           # Produits, catégories, médias
│   │   ├── models.py      # Category, Product, ProductImage
│   │   ├── serializers.py
│   │   ├── views.py       # ViewSets DRF
│   │   ├── urls.py
│   │   └── admin.py
│   ├── cart/              # Panier serveur optionnel (sinon panier client-side)
│   │   └── models.py      # Cart, CartItem (clé de session)
│   ├── orders/            # Commandes + statuts
│   │   ├── models.py      # Order, OrderItem, ShippingAddress
│   │   ├── serializers.py
│   │   ├── views.py       # création de commande, consultation
│   │   └── services.py    # logique métier
│   ├── payments/          # Intégration Stripe + PayPal
│   │   ├── stripe_service.py   # create_payment_intent, webhook
│   │   ├── paypal_service.py   # create_order, capture, webhook
│   │   └── views.py
│   ├── quotes/            # Demandes de devis sur mesure
│   │   ├── models.py      # QuoteRequest
│   │   ├── serializers.py
│   │   └── views.py
│   └── contact/           # Formulaire de contact (email transactionnel)
│       └── views.py
└── media/                 # Uploads (images produits)
```

## Dépendances clés

- `Django>=5.0`
- `djangorestframework`
- `django-cors-headers` (CORS vers http://localhost:5173 en dev)
- `Pillow` (images)
- `python-decouple` ou `django-environ` (variables d'environnement)
- `stripe` (SDK officiel)
- `paypalserversdk` (SDK officiel PayPal)
- `django-filter` (filtres DRF pour le catalogue)

## Endpoints REST visés

| Méthode | URL                                  | Rôle                                    |
|---------|--------------------------------------|-----------------------------------------|
| GET     | /api/catalog/categories/             | Liste des catégories                    |
| GET     | /api/catalog/products/               | Liste paginée + filtres (catégorie, prix, recherche) |
| GET     | /api/catalog/products/<slug>/        | Détail produit                          |
| POST    | /api/quotes/                         | Création d'une demande de devis         |
| POST    | /api/contact/                        | Envoi d'un message de contact           |
| POST    | /api/orders/                         | Création d'une commande (panier côté front envoyé) |
| GET     | /api/orders/<id>/                    | Consultation d'une commande             |
| POST    | /api/payments/stripe/intent/         | Création d'un PaymentIntent Stripe      |
| POST    | /api/payments/stripe/webhook/        | Réception des webhooks Stripe           |
| POST    | /api/payments/paypal/order/          | Création d'un ordre PayPal              |
| POST    | /api/payments/paypal/capture/        | Capture du paiement PayPal              |
| POST    | /api/payments/paypal/webhook/        | Webhook PayPal                          |

## Modèle `Product` (esquisse)

```python
class Product(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=160)
    category = models.ForeignKey('Category', on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    short_description = models.CharField(max_length=280)
    description = models.TextField()
    dimensions = models.CharField(max_length=80, blank=True)
    materials = models.JSONField(default=list)  # liste de chaînes
    lead_time = models.CharField(max_length=80, blank=True)
    colors = models.JSONField(default=list)
    badge = models.CharField(max_length=40, blank=True)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## Flux de paiement (Stripe)

1. Front → `POST /api/orders/` : crée une commande `pending` avec les items.
2. Front → `POST /api/payments/stripe/intent/` avec l'ID de commande.
3. Back → crée un `PaymentIntent` Stripe et renvoie le `client_secret`.
4. Front → confirme le paiement avec Stripe Elements.
5. Stripe → webhook → back marque la commande `paid`, envoie l'email.
6. Front → redirige vers `/confirmation?o=<id>`.

## Flux de paiement (PayPal)

1. Front → `POST /api/orders/`.
2. Front → `POST /api/payments/paypal/order/` → renvoie l'`approveUrl`.
3. Front → redirige l'utilisateur vers PayPal, qui revient sur `/paiement?paypalId=…`.
4. Front → `POST /api/payments/paypal/capture/` → back capture et marque la commande `paid`.

## CORS / intégration front

- En dev : Vite tourne sur `:5173`, Django sur `:8000`, proxy déjà configuré
  dans `vite.config.js` (`/api` → `127.0.0.1:8000`).
- En prod : front statique servi par Nginx (ou CDN), back sur sous-domaine
  `api.vitraux-lorrain.fr`.

## Prochaines étapes

1. `django-admin startproject config backend` + arborescence ci-dessus.
2. `startapp catalog`, puis modèles + migrations + admin.
3. Seeder de produits à partir de `src/data/products.js` pour garder la cohérence.
4. Brancher le front : remplacer l'import `products.js` par un appel `GET /api/catalog/products/`.
5. Implémenter les apps `orders` et `payments`.
