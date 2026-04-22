import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h4 className={styles.brand}>Atelier Vitraux Lorrain</h4>
          <p className={styles.copy}>
            Verre soufflé, plomb, cuivre — des vitraux conçus à la main à Nancy,
            dans la tradition des maîtres verriers lorrains.
          </p>
          <address className={styles.addr}>
            12 rue des Jardiniers<br />
            54000 Nancy, France<br />
            <a href="tel:+33383000000">03 83 00 00 00</a> ·{' '}
            <a href="mailto:contact@vitraux-lorrain.fr">contact@vitraux-lorrain.fr</a>
          </address>
        </div>

        <div className={styles.col}>
          <h5>Boutique</h5>
          <ul>
            <li><Link to="/boutique">Toutes les créations</Link></li>
            <li><Link to="/boutique?categorie=panneaux">Panneaux</Link></li>
            <li><Link to="/boutique?categorie=luminaires">Luminaires</Link></li>
            <li><Link to="/sur-mesure">Demander un devis</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h5>L'atelier</h5>
          <ul>
            <li><Link to="/a-propos">Notre savoir-faire</Link></li>
            <li><Link to="/contact">Nous contacter</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/cgv">CGV</Link></li>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h5>Lettre de l'atelier</h5>
          <p>Nos nouvelles créations, une fois par saison. Jamais plus.</p>
          <form
            className={styles.newsletter}
            onSubmit={(e) => {
              e.preventDefault();
              // branchement API plus tard
            }}
          >
            <Input
              type="email"
              name="email"
              label="Votre email"
              required
            />
            <Button type="submit" variant="primary" size="md">
              S'inscrire
            </Button>
          </form>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {year} Atelier Vitraux Lorrain — Tous droits réservés.</span>
        <span className={styles.craft}>Fait main · Nancy, France</span>
      </div>
    </footer>
  );
}
