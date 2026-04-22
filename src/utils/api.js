const PLACEHOLDERS = {
  'panneau-iris-lorrain':      new URL('../assets/images/panneau-iris.svg',       import.meta.url).href,
  'lampe-tiffany-automne':     new URL('../assets/images/lampe-tiffany.svg',      import.meta.url).href,
  'medaillon-soleil-couchant': new URL('../assets/images/medaillon-soleil.svg',   import.meta.url).href,
  'suspension-feuillage':      new URL('../assets/images/suspension-feuillage.svg', import.meta.url).href,
};

const CATEGORY_FALLBACK = {
  panneaux:   new URL('../assets/images/panneau-iris.svg',     import.meta.url).href,
  luminaires: new URL('../assets/images/lampe-tiffany.svg',    import.meta.url).href,
  medaillons: new URL('../assets/images/medaillon-soleil.svg', import.meta.url).href,
};

function resolveImage(raw) {
  // Liste (ProductListSerializer) → thumbnail
  if (raw.thumbnail) return raw.thumbnail;
  // Détail (ProductDetailSerializer) → première image du tableau
  if (raw.images?.length) return raw.images[0].image;
  // Fallback : SVG placeholder selon le slug ou la catégorie
  return PLACEHOLDERS[raw.slug] ?? CATEGORY_FALLBACK[raw.category_slug] ?? null;
}

export function normalizeProduct(raw) {
  return {
    ...raw,
    image:            resolveImage(raw),
    shortDescription: raw.short_description ?? raw.shortDescription ?? '',
    inStock:          raw.in_stock          ?? raw.inStock          ?? true,
    leadTime:         raw.lead_time         ?? raw.leadTime         ?? '',
    category:         raw.category_slug     ?? raw.category?.slug   ?? raw.category ?? '',
  };
}

export async function postJSON(path, body) {
  const token = localStorage.getItem('access_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
}
