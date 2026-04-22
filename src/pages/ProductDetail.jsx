import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import Lightbox from '../components/ui/Lightbox.jsx';
import ProductReviews from '../components/product/ProductReviews.jsx';
import { useProduct } from '../hooks/useProducts.js';
import { useCart } from '../hooks/useCart.js';
import { useWishlist } from '../hooks/useWishlist.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatPrice } from '../utils/format.js';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [quantity,    setQuantity]  = useState(1);
  const [activeImg,   setActiveImg] = useState(0);
  const [lightboxIdx, setLightbox]  = useState(null);

  const wished = product ? isWishlisted(product.id) : false;

  const handleWishlist = async () => {
    const done = await toggle(product);
    if (!done) navigate('/connexion');
  };

  // Tous les hooks AVANT les return anticipés
  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.images?.length) {
      return product.images.map(img => ({ src: img.image, alt: img.alt_text || product.name }));
    }
    return [{ src: product.image, alt: product.name }];
  }, [product]);

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-light)' }}>
          Chargement…
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section">
        <div className="container">
          <h1>Création introuvable</h1>
          <p>Cette création n'existe pas ou n'est plus disponible.</p>
          <Button as={Link} to="/boutique" variant="ghost">Retour à la boutique</Button>
        </div>
      </section>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    navigate('/panier');
  };

  return (
    <section className="section">
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span>·</span>
          <Link to="/boutique">Boutique</Link>
          <span>·</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          <div className={`${styles.mediaCol} anim-fade-in`}>
            {/* Image principale — cliquable pour lightbox */}
            <div className={`${styles.media} ${styles.mediaClickable}`} onClick={() => setLightbox(activeImg)}>
              <img
                src={gallery[activeImg]?.src}
                alt={gallery[activeImg]?.alt}
                key={gallery[activeImg]?.src}
              />
              {product.badge && (
                <div className={styles.badge}>
                  <Badge tone={product.badge === 'Best-seller' ? 'warm' : 'emerald'}>
                    {product.badge}
                  </Badge>
                </div>
              )}
              <span className={styles.zoomHint} aria-hidden="true">⊕ Agrandir</span>
            </div>

            {/* Miniatures */}
            {gallery.length > 1 && (
              <div className={styles.thumbs}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img.src} alt={img.alt} />
                  </button>
                ))}
              </div>
            )}

            {/* Lightbox */}
            {lightboxIdx !== null && (
              <Lightbox
                images={gallery}
                startIndex={lightboxIdx}
                onClose={() => setLightbox(null)}
              />
            )}
          </div>

          <div className={`${styles.info} anim-fade-in-up`}>
            <span className="eyebrow" style={{ color: 'var(--accent-warm)', letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
              Création artisanale
            </span>
            <h1>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>

            <p className={styles.description}>{product.description}</p>

            <dl className={styles.specs}>
              <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>
              <div><dt>Délai</dt><dd>{product.leadTime}</dd></div>
              <div>
                <dt>Matériaux</dt>
                <dd>{product.materials.join(' · ')}</dd>
              </div>
              <div>
                <dt>Palette</dt>
                <dd className={styles.palette} aria-hidden="true">
                  {product.colors.map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </dd>
              </div>
            </dl>

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.wishBtn} ${wished ? styles.wishBtnOn : ''}`}
                onClick={handleWishlist}
                aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {wished ? '♥ Dans vos favoris' : '♡ Ajouter aux favoris'}
              </button>

              <div className={styles.qty}>
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  aria-label="Quantité"
                />
                <button type="button" onClick={() => setQuantity(q => q + 1)} aria-label="Augmenter">+</button>
              </div>

              {product.inStock ? (
                <Button variant="warm" size="lg" onClick={handleAdd}>
                  Ajouter au panier
                </Button>
              ) : (
                <Button as={Link} to="/sur-mesure" variant="primary" size="lg">
                  Demander sur commande
                </Button>
              )}
            </div>

            <p className={styles.reassurance}>
              ✦ Emballage sécurisé · Livraison assurée · Paiement sécurisé (Stripe &amp; PayPal)
            </p>
          </div>
        </div>

        <ProductReviews slug={slug} />

      </div>
    </section>
  );
}
