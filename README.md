# Atelier Vitraux Lorrain — site e-commerce

Site e-commerce complet pour un atelier artisanal de vitraux basé à Nancy.
Ce dépôt contient pour l'instant le **front-end React + Vite**. Le back-end
Django est planifié dans `BACKEND_PLAN.md`.

## Stack

- **React 18** + **Vite 5**, JavaScript pur (pas de TypeScript)
- **React Router 6** pour le routing
- **CSS Modules** + variables CSS (design system maison, palette « Terre & Émeraude »)
- Aucune dépendance UI externe : tous les composants sont faits main

## Lancer le projet

```bash
npm install
npm run dev
```

Le site démarre sur `http://localhost:5173`. Le proxy `/api` pointe déjà vers
`http://127.0.0.1:8000` en prévision du back Django.

## Arborescence

```
src/
├── assets/images/        Illustrations SVG des créations
├── components/
│   ├── layout/           Navbar, Footer, Layout
│   ├── ui/               Button, Input, Badge, Section
│   ├── product/          ProductCard, ProductGrid, ProductFilters
│   └── cart/             CartItem, CartSummary
├── context/              CartContext (état global panier)
├── data/                 products.js (mock, remplacera un appel API)
├── hooks/                useCart
├── pages/                Home, Catalog, ProductDetail, About, Quote,
│                         Contact, Cart, Checkout, Confirmation, Legal
├── routes/               AppRoutes
├── styles/               variables.css, global.css, animations.css
└── utils/                format.js (formatPrice, slugify)
```

## Pages livrées

| Chemin              | Page              |
|---------------------|-------------------|
| `/`                 | Accueil           |
| `/boutique`         | Catalogue         |
| `/produit/:slug`    | Fiche produit     |
| `/a-propos`         | L'atelier         |
| `/sur-mesure`       | Demande de devis  |
| `/contact`          | Contact           |
| `/panier`           | Panier            |
| `/paiement`         | Checkout (Stripe + PayPal) |
| `/confirmation`     | Confirmation      |
| `/mentions-legales` | Mentions légales  |
| `/cgv`              | CGV               |
| `/confidentialite`  | Confidentialité   |

## Design system

- Palette : émeraude profond, terracotta, or pâle, crème. Tout est dans
  `src/styles/variables.css` : il suffit d'y modifier les tokens pour
  changer l'identité du site.
- Typographie : Cormorant Garamond (display) + Inter (texte), chargées
  via Google Fonts dans `index.html`.
- Animations premium :
    - boutons avec shine diagonal, spring bounce et press feedback,
    - hero avec effet de profondeur sur le « vitrail »,
    - apparitions en cascade (`.anim-stagger`).

## Back-end

Voir `BACKEND_PLAN.md` pour la structure Django à venir : apps `catalog`,
`cart`, `orders`, `payments` (Stripe + PayPal), `quotes`, `contact`.

## À faire

- [ ] Scaffolder le projet Django
- [ ] Brancher le front sur l'API (remplacer `data/products.js`)
- [ ] Intégrer Stripe Elements + PayPal JS SDK dans `Checkout`
- [ ] Tests E2E (Playwright) du tunnel de commande
