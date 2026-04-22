import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';
import styles from './Cart.module.css';

export default function Cart() {
  const { items } = useCart();

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Votre panier</span>
          <h1>{items.length === 0 ? 'Votre panier est vide' : 'Vos créations'}</h1>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Aucune création n'a encore rejoint votre panier.</p>
            <Button as={Link} to="/boutique" variant="primary" size="lg">
              Découvrir la boutique
            </Button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.list}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
          </div>
        )}
      </div>
    </section>
  );
}
