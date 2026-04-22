import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/format.js';
import styles from './CartItem.module.css';

export default function CartItem({ item }) {
  const { setQuantity, removeItem } = useCart();

  return (
    <article className={styles.item}>
      <Link to={`/produit/${item.slug}`} className={styles.thumb}>
        <img src={item.image} alt="" />
      </Link>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={`/produit/${item.slug}`}>{item.name}</Link>
        </h3>
        <span className={styles.unit}>{formatPrice(item.price)} / pièce</span>
      </div>

      <div className={styles.qty}>
        <button
          type="button"
          onClick={() => setQuantity(item.id, item.quantity - 1)}
          aria-label={`Diminuer la quantité de ${item.name}`}
          disabled={item.quantity <= 1}
        >−</button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => setQuantity(item.id, Number(e.target.value) || 1)}
          aria-label="Quantité"
        />
        <button
          type="button"
          onClick={() => setQuantity(item.id, item.quantity + 1)}
          aria-label={`Augmenter la quantité de ${item.name}`}
        >+</button>
      </div>

      <div className={styles.total}>{formatPrice(item.price * item.quantity)}</div>

      <button
        type="button"
        className={styles.remove}
        onClick={() => removeItem(item.id)}
        aria-label={`Retirer ${item.name}`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/>
        </svg>
      </button>
    </article>
  );
}
