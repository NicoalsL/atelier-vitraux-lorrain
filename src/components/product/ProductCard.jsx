import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Lightbox from '../ui/Lightbox.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useWishlist } from '../../hooks/useWishlist.js';
import { formatPrice } from '../../utils/format.js';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const wished = isWishlisted(product.id);
  const [lightbox, setLightbox] = useState(false);
  const gallery = product.image ? [{ src: product.image, alt: product.name }] : [];

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    const done = await toggle(product);
    if (!done) navigate('/connexion');
  };

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className={styles.mediaImg}
          onClick={() => gallery.length && setLightbox(true)}
          style={{ cursor: gallery.length ? 'zoom-in' : 'default' }}
        />
        <Link to={`/produit/${product.slug}`} className={styles.mediaOverlay} aria-label={product.name} />
        {product.badge && (
          <div className={styles.badge}>
            <Badge tone={product.badge === 'Best-seller' ? 'warm' : 'emerald'}>
              {product.badge}
            </Badge>
          </div>
        )}
        <button
          type="button"
          className={`${styles.wishBtn} ${wished ? styles.wishBtnOn : ''}`}
          onClick={handleWishlist}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {wished ? '♥' : '♡'}
        </button>
        {lightbox && <Lightbox images={gallery} startIndex={0} onClose={() => setLightbox(false)} />}
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.title}>
            <Link to={`/produit/${product.slug}`}>{product.name}</Link>
          </h3>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>
        <p className={styles.desc}>{product.shortDescription}</p>

        <div className={styles.palette} aria-hidden="true">
          {product.colors?.slice(0, 4).map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>

        <div className={styles.cta}>
          <Button
            variant="warm"
            size="sm"
            onClick={handleAdd}
            disabled={!product.inStock}
            iconRight={
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            {product.inStock ? 'Ajouter' : 'Nous contacter'}
          </Button>
          <Link to={`/produit/${product.slug}`} className={styles.link}>
            Voir détails
          </Link>
        </div>
      </div>
    </article>
  );
}
