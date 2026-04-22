import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('stripe');
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', address: '', zip: '', city: '', country: 'France',
    email: '', phone: '',
  });

  if (items.length === 0) return <Navigate to="/panier" replace />;

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const updateShipping = (k) => (e) =>
    setShipping((v) => ({ ...v, [k]: e.target.value }));

  const handlePay = () => {
    // Plus tard : createPaymentIntent sur Stripe, ou redirection PayPal.
    // Ici on simule un succès et on redirige vers la confirmation.
    const orderId = 'AVL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    clear();
    navigate(`/confirmation?o=${orderId}&m=${method}`);
  };

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Commande</span>
          <h1>Finaliser votre commande</h1>
        </header>

        {/* Stepper */}
        <ol className={styles.stepper} aria-label="Étapes de commande">
          {['Livraison', 'Paiement', 'Confirmation'].map((label, i) => {
            const idx = i + 1;
            return (
              <li
                key={label}
                className={`${styles.step} ${idx === step ? styles.active : ''} ${idx < step ? styles.done : ''}`}
              >
                <span className={styles.stepDot}>{idx < step ? '✓' : idx}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className={styles.layout}>
          <div className={styles.panel}>
            {step === 1 && (
              <form
                className={styles.form}
                onSubmit={(e) => { e.preventDefault(); next(); }}
              >
                <h3>Adresse de livraison</h3>

                <div className={styles.row2}>
                  <Input label="Prénom" required value={shipping.firstName} onChange={updateShipping('firstName')} />
                  <Input label="Nom" required value={shipping.lastName} onChange={updateShipping('lastName')} />
                </div>
                <Input label="Adresse" required value={shipping.address} onChange={updateShipping('address')} />
                <div className={styles.row2}>
                  <Input label="Code postal" required value={shipping.zip} onChange={updateShipping('zip')} />
                  <Input label="Ville" required value={shipping.city} onChange={updateShipping('city')} />
                </div>
                <Input label="Pays" required value={shipping.country} onChange={updateShipping('country')} />
                <div className={styles.row2}>
                  <Input label="Email" type="email" required value={shipping.email} onChange={updateShipping('email')} />
                  <Input label="Téléphone" required value={shipping.phone} onChange={updateShipping('phone')} />
                </div>

                <div className={styles.actions}>
                  <Button type="submit" variant="primary" size="lg">
                    Continuer vers le paiement
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className={styles.form}>
                <h3>Méthode de paiement</h3>

                <div className={styles.methods}>
                  <label className={`${styles.method} ${method === 'stripe' ? styles.methodActive : ''}`}>
                    <input
                      type="radio" name="method" value="stripe"
                      checked={method === 'stripe'}
                      onChange={(e) => setMethod(e.target.value)}
                    />
                    <div>
                      <strong>Carte bancaire</strong>
                      <span>Paiement sécurisé via Stripe · CB, Visa, Mastercard</span>
                    </div>
                    <span className={styles.methodMark} aria-hidden>◉</span>
                  </label>

                  <label className={`${styles.method} ${method === 'paypal' ? styles.methodActive : ''}`}>
                    <input
                      type="radio" name="method" value="paypal"
                      checked={method === 'paypal'}
                      onChange={(e) => setMethod(e.target.value)}
                    />
                    <div>
                      <strong>PayPal</strong>
                      <span>Redirection vers PayPal pour valider votre paiement</span>
                    </div>
                    <span className={styles.methodMark} aria-hidden>◉</span>
                  </label>
                </div>

                {method === 'stripe' && (
                  <div className={styles.fakeCard}>
                    <Input label="Numéro de carte" inputMode="numeric" />
                    <div className={styles.row2}>
                      <Input label="Expiration (MM/AA)" />
                      <Input label="CVC" inputMode="numeric" />
                    </div>
                    <p className={styles.cardHint}>
                      L'intégration finale utilisera Stripe Elements pour la
                      saisie sécurisée des informations bancaires.
                    </p>
                  </div>
                )}

                <div className={styles.actions}>
                  <Button variant="ghost" size="md" onClick={prev}>← Retour</Button>
                  <Button variant="primary" size="lg" onClick={handlePay}>
                    Payer maintenant
                  </Button>
                </div>
              </div>
            )}
          </div>

          <CartSummary showCheckout={false} />
        </div>
      </div>
    </section>
  );
}
