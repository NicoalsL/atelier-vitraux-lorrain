import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/format.js';
import styles from './CartSummary.module.css';

const SHIPPING = 18;

export default function CartSummary({ showCheckout = true, variant = 'sticky', onPromo }) {
  const { subtotal, count } = useCart();
  const shipping = subtotal > 500 || count === 0 ? 0 : SHIPPING;

  const [code, setCode]       = useState('');
  const [promo, setPromo]     = useState(null);
  const [promoErr, setPromoErr] = useState('');
  const [checking, setChecking] = useState(false);

  const discount = promo ? parseFloat(promo.discount) : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setPromoErr('');
    const r = await fetch('/api/orders/promo/validate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
    });
    setChecking(false);
    const data = await r.json();
    if (r.ok) {
      setPromo(data);
      onPromo?.(data);
    } else {
      setPromoErr(data.detail || 'Code invalide.');
      setPromo(null);
      onPromo?.(null);
    }
  };

  const removePromo = () => {
    setPromo(null);
    setCode('');
    setPromoErr('');
    onPromo?.(null);
  };

  return (
    <aside className={`${styles.summary} ${styles[variant]}`}>
      <h3 className={styles.title}>Récapitulatif</h3>

      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Sous-total</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className={styles.line}>
          <dt>Livraison</dt>
          <dd>{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</dd>
        </div>
        {discount > 0 && (
          <div className={`${styles.line} ${styles.lineDiscount}`}>
            <dt>Réduction ({promo.code})</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className={`${styles.line} ${styles.total}`}>
          <dt>Total TTC</dt>
          <dd>{formatPrice(Math.max(0, total))}</dd>
        </div>
      </dl>

      {/* Code promo */}
      {!promo ? (
        <div className={styles.promoRow}>
          <input
            className={styles.promoInput}
            placeholder="Code promo"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && applyPromo()}
          />
          <button className={styles.promoBtn} onClick={applyPromo} disabled={checking || !code.trim()}>
            {checking ? '…' : 'Appliquer'}
          </button>
        </div>
      ) : (
        <div className={styles.promoApplied}>
          <span>✓ {promo.code} — {promo.discount_type === 'percent' ? `${promo.discount_value}% de remise` : `${formatPrice(parseFloat(promo.discount_value))} de remise`}</span>
          <button className={styles.promoRemove} onClick={removePromo}>✕</button>
        </div>
      )}
      {promoErr && <p className={styles.promoErr}>{promoErr}</p>}

      {subtotal > 0 && subtotal < 500 && (
        <p className={styles.hint}>
          Plus que <strong>{formatPrice(500 - subtotal)}</strong> pour bénéficier
          de la livraison offerte.
        </p>
      )}

      {showCheckout && (
        <div className={styles.actions}>
          <Button
            as={Link}
            to="/paiement"
            variant="primary"
            size="lg"
            fullWidth
            disabled={count === 0}
            iconRight={
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          >
            Passer au paiement
          </Button>
          <Link to="/boutique" className={styles.continue}>← Poursuivre mes achats</Link>
        </div>
      )}
    </aside>
  );
}
