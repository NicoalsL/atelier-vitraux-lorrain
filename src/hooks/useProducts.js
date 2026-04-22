import { useState, useEffect } from 'react';
import { normalizeProduct } from '../utils/api.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch('/api/catalog/categories/')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories((data.results ?? data).map(c => ({ slug: c.slug, label: c.name }))))
      .catch(() => {});
  }, []);
  return categories;
}

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined && v !== 'all') qs.set(k, v);
    });
    fetch(`/api/catalog/products/?${qs}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('API error')))
      .then(data => setProducts((data.results ?? data).map(normalizeProduct)))
      .catch(err  => setError(err))
      .finally(()  => setLoading(false));
  }, [key]); // eslint-disable-line

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/catalog/products/${slug}/`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status === 404 ? 'not_found' : 'error')))
      .then(data => setProduct(normalizeProduct(data)))
      .catch(err  => setError(err))
      .finally(()  => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
