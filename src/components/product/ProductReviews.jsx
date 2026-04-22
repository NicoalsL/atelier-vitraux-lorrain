import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './ProductReviews.module.css';

function Stars({ value, interactive = false, onChange }) {
  return (
    <span className={styles.stars} aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`${styles.star} ${n <= value ? styles.starOn : ''} ${interactive ? styles.starInteractive : ''}`}
          onClick={() => interactive && onChange?.(n)}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={interactive ? (e) => e.key === 'Enter' && onChange?.(n) : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductReviews({ slug }) {
  const { user, accessToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 0, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/catalog/products/${slug}/reviews/`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setReviews(Array.isArray(data) ? data : (data.results || [])))
      .finally(() => setLoading(false));
  }, [slug, submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setError('Veuillez sélectionner une note.'); return; }
    if (!form.body.trim()) { setError('Veuillez écrire un commentaire.'); return; }
    setError('');
    setSubmitting(true);
    const r = await fetch(`/api/catalog/products/${slug}/reviews/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (r.ok) {
      setForm({ rating: 0, title: '', body: '' });
      setSubmitted(s => !s);
    } else {
      const data = await r.json();
      setError(data.non_field_errors?.[0] || data.detail || 'Une erreur est survenue.');
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Avis clients
        {avg && <span className={styles.avg}><Stars value={Math.round(avg)} /> {avg}/5 <span className={styles.count}>({reviews.length} avis)</span></span>}
      </h2>

      {loading && <p className={styles.empty}>Chargement…</p>}

      {!loading && reviews.length === 0 && (
        <p className={styles.empty}>Aucun avis pour l'instant. Soyez le premier !</p>
      )}

      {reviews.map(review => (
        <div key={review.id} className={styles.review}>
          <div className={styles.reviewHead}>
            <Stars value={review.rating} />
            <strong className={styles.reviewAuthor}>{review.author_name}</strong>
            <span className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          {review.title && <p className={styles.reviewTitle}>{review.title}</p>}
          <p className={styles.reviewBody}>{review.body}</p>
        </div>
      ))}

      <div className={styles.formWrap}>
        {!user ? (
          <p className={styles.loginHint}>
            <Link to="/connexion">Connectez-vous</Link> pour laisser un avis.
          </p>
        ) : (
          <>
            <h3 className={styles.formTitle}>Laisser un avis</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.label}>
                Note
                <Stars value={form.rating} interactive onChange={n => setForm(f => ({ ...f, rating: n }))} />
              </label>
              <label className={styles.label}>
                Titre (optionnel)
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Résumez votre expérience"
                  maxLength={120}
                />
              </label>
              <label className={styles.label}>
                Commentaire
                <textarea
                  className={styles.textarea}
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Partagez votre expérience avec cette création…"
                  rows={4}
                  required
                />
              </label>
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Envoi…' : 'Publier mon avis'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
