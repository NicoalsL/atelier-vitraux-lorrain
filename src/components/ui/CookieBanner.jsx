import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem('cookie_consent', 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Consentement aux cookies">
      <div className={styles.inner}>
        <p className={styles.text}>
          Ce site utilise uniquement des cookies essentiels au fonctionnement (session, panier, connexion).
          Aucun cookie publicitaire ou de tracking tiers n'est utilisé.{' '}
          <Link to="/confidentialite" className={styles.link}>En savoir plus</Link>
        </p>
        <div className={styles.actions}>
          <button className={styles.btnAccept} onClick={accept}>Accepter</button>
          <button className={styles.btnRefuse} onClick={refuse}>Continuer sans accepter</button>
        </div>
      </div>
    </div>
  );
}
