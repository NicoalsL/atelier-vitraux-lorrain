import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import styles from './Confirmation.module.css';

const METHOD_LABEL = {
  stripe: 'Carte bancaire (Stripe)',
  paypal: 'PayPal',
};

export default function Confirmation() {
  const [params] = useSearchParams();
  const orderId = params.get('o') || 'AVL-000000';
  const method = METHOD_LABEL[params.get('m')] || 'Paiement sécurisé';

  return (
    <section className="section">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.starburst}>
            <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
              <defs>
                <radialGradient id="conf" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#fff4dc"/>
                  <stop offset="100%" stopColor="#c9a96a"/>
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="40" fill="url(#conf)"/>
              <circle cx="60" cy="60" r="40" fill="none" stroke="#1a1a18" strokeWidth="2"/>
              <g stroke="#1a1a18" strokeWidth="2">
                <line x1="60" y1="6" x2="60" y2="24"/>
                <line x1="60" y1="96" x2="60" y2="114"/>
                <line x1="6" y1="60" x2="24" y2="60"/>
                <line x1="96" y1="60" x2="114" y2="60"/>
                <line x1="22" y1="22" x2="34" y2="34"/>
                <line x1="86" y1="86" x2="98" y2="98"/>
                <line x1="98" y1="22" x2="86" y2="34"/>
                <line x1="22" y1="98" x2="34" y2="86"/>
              </g>
              <path d="M45 62 L55 72 L77 48" fill="none" stroke="#1f4e3d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <span className="eyebrow" style={{ color: 'var(--accent-warm)', letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>
            Commande confirmée
          </span>
          <h1>Merci pour votre confiance.</h1>
          <p className={styles.lead}>
            Votre commande <strong>#{orderId}</strong> a bien été enregistrée.
            Un email de confirmation vous a été envoyé.
          </p>

          <dl className={styles.summary}>
            <div><dt>Numéro</dt><dd>{orderId}</dd></div>
            <div><dt>Paiement</dt><dd>{method}</dd></div>
            <div><dt>Expédition</dt><dd>Sous 5 à 7 jours ouvrés</dd></div>
          </dl>

          <div className={styles.actions}>
            <Button as={Link} to="/boutique" variant="primary" size="lg">
              Continuer à visiter
            </Button>
            <Button as={Link} to="/" variant="ghost" size="lg">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
