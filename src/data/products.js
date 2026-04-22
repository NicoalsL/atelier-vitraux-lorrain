/**
 * Données mock — sera remplacé par GET /api/products/ (Django) plus tard.
 *
 * Chaque produit expose une "image" qui est ici un import d'un SVG local
 * (placeholder évocateur de vitrail), et une palette indicative.
 */

import panneauHero from '../assets/images/panneau-iris.svg';
import lampeTiffany from '../assets/images/lampe-tiffany.svg';
import medaillonSoleil from '../assets/images/medaillon-soleil.svg';
import suspension from '../assets/images/suspension-feuillage.svg';

export const categories = [
  { slug: 'panneaux',   label: 'Panneaux' },
  { slug: 'luminaires', label: 'Luminaires' },
  { slug: 'medaillons', label: 'Médaillons' },
];

export const products = [
  {
    id: 'p-001',
    slug: 'panneau-iris-lorrain',
    name: 'Panneau « Iris Lorrain »',
    category: 'panneaux',
    price: 1280,
    image: panneauHero,
    shortDescription:
      'Panneau décoratif inspiré de l\'École de Nancy, iris stylisés en verres antiques soufflés.',
    description:
      'Cette pièce unique reprend les motifs floraux emblématiques de l\'École de Nancy. Les verres antiques soufflés à la bouche laissent passer la lumière en nuances profondes, soutenus par un sertissage plomb patiné à la main. Idéal pour une fenêtre de séjour ou un claustra intérieur.',
    dimensions: '60 × 80 cm',
    materials: ['Verre antique soufflé', 'Plomb patiné', 'Soudure étain'],
    leadTime: '3 à 4 semaines',
    colors: ['#1f4e3d', '#c97b5a', '#d9b382', '#faf6ef'],
    inStock: true,
    badge: 'Pièce unique',
  },
  {
    id: 'p-002',
    slug: 'lampe-tiffany-automne',
    name: 'Lampe Tiffany « Automne »',
    category: 'luminaires',
    price: 690,
    image: lampeTiffany,
    shortDescription:
      'Lampe de table en technique Tiffany, camaïeu ambré et émeraude, lumière chaude.',
    description:
      'Abat-jour composé de plus de 180 pièces de verre cathédrale assemblées au ruban de cuivre. Pied en laiton patiné, douille E14. Diffuse une lumière chaude, idéale en chevet ou sur un bureau.',
    dimensions: 'Ø 28 × H 42 cm',
    materials: ['Verre cathédrale', 'Ruban de cuivre', 'Laiton patiné'],
    leadTime: '2 à 3 semaines',
    colors: ['#a05438', '#1f4e3d', '#d9b382'],
    inStock: true,
    badge: 'Best-seller',
  },
  {
    id: 'p-003',
    slug: 'medaillon-soleil-couchant',
    name: 'Médaillon « Soleil couchant »',
    category: 'medaillons',
    price: 320,
    image: medaillonSoleil,
    shortDescription:
      'Médaillon rond à suspendre, rayons ambrés sur fond émeraude, finition plomb étiré.',
    description:
      'Petit médaillon de 30 cm de diamètre, livré avec chaînette en laiton pour suspension devant une fenêtre. Les rayons en verre ambré irisé captent la lumière du matin avec des reflets chatoyants.',
    dimensions: 'Ø 30 cm',
    materials: ['Verre irisé', 'Plomb étiré', 'Chaînette laiton'],
    leadTime: '1 à 2 semaines',
    colors: ['#c97b5a', '#d9b382', '#1f4e3d'],
    inStock: true,
    badge: null,
  },
  {
    id: 'p-004',
    slug: 'suspension-feuillage',
    name: 'Suspension « Feuillage »',
    category: 'luminaires',
    price: 940,
    image: suspension,
    shortDescription:
      'Suspension sphérique, feuilles de vigne en verre cathédrale vert, monture laiton.',
    description:
      'Suspension composée de 72 feuilles découpées et cuivrées individuellement, puis soudées à l\'étain. L\'ensemble diffuse une lumière tamisée rappelant la sous-bois. Livré avec 1,5 m de câble textile noir.',
    dimensions: 'Ø 40 × H 38 cm',
    materials: ['Verre cathédrale', 'Ruban de cuivre', 'Laiton'],
    leadTime: '3 à 4 semaines',
    colors: ['#1f4e3d', '#2f6e57', '#6fa593'],
    inStock: false,
    badge: 'Sur commande',
  },
];

export function findProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}
