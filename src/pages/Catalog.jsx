import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import { useProducts, useCategories } from '../hooks/useProducts.js';
import styles from './Catalog.module.css';

const PRICE_CAP = 2000;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query,     setQuery]     = useState('');
  const [category,  setCategory]  = useState(searchParams.get('categorie') || 'all');
  const [maxPrice,  setMaxPrice]  = useState(PRICE_CAP);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce la recherche texte (300 ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Synchroniser l'URL avec la catégorie
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (category === 'all') next.delete('categorie');
    else next.set('categorie', category);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const apiParams = {
    ...(category !== 'all' ? { category } : {}),
    ...(debouncedQuery    ? { search: debouncedQuery } : {}),
    ...(maxPrice < PRICE_CAP ? { max_price: maxPrice } : {}),
  };

  const { products: filtered, loading } = useProducts(apiParams);
  const categories = useCategories();

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Boutique</span>
          <h1>Nos créations</h1>
          <p className="lead">
            Des pièces uniques ou en très petites éditions, disponibles à la vente
            en ligne. Chaque création est expédiée avec soin depuis Nancy.
          </p>
        </header>

        <div className={styles.layout}>
          <ProductFilters
            query={query}
            onQueryChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            priceCap={PRICE_CAP}
            categories={categories}
          />

          <div>
            <div className={styles.toolbar}>
              <span className={styles.count}>
                {loading ? '…' : `${filtered.length} création${filtered.length > 1 ? 's' : ''}`}
              </span>
            </div>
            {loading
              ? <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>Chargement…</p>
              : <ProductGrid
                  products={filtered}
                  empty="Aucune création ne correspond à vos filtres. Essayez d'assouplir la recherche."
                />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
