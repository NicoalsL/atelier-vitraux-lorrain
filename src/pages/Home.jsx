import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useProducts } from '../hooks/useProducts.js';
import styles from './Home.module.css';
import BtnVitraux from '../components/ui/BtnVitraux.jsx';
import BtnVitraux2 from '../components/ui/BtnVitraux2.jsx';

export default function Home() {
  const { products: featured, loading } = useProducts({ featured: 'true' });

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={`${styles.eyebrow} anim-fade-in-up`}>Atelier d'art · Metz</span>
            <h1 className="anim-fade-in-up" style={{ animationDelay: '80ms' }}>
              La lumière,<br />
              <em>matériau d'exception.</em>
            </h1>
            <p className="anim-fade-in-up" style={{ animationDelay: '180ms' }}>
              Vitraux d'art, luminaires et médaillons façonnés à la main dans la
              tradition des maîtres verriers lorrains. Chaque pièce est unique,
              pensée pour faire vibrer la lumière dans votre intérieur.
            </p>
            <div className={`${styles.heroCtas} anim-fade-in-up`} style={{ animationDelay: '280ms' }}>
              <Button as={Link} to="/boutique" variant="primary" size="lg">
                Explorer la boutique
              </Button>
              <Button as={Link} to="/sur-mesure" variant="ghost" size="lg">
                Commande sur mesure
              </Button>
            </div>
          </div>

          <div className={`${styles.heroArt} anim-fade-in`} aria-hidden="true">
            <div className={styles.window}>
              {/* Vitrail stylisé en CSS pur + SVG */}
              <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d9b382"/>
                    <stop offset="60%" stopColor="#c97b5a"/>
                    <stop offset="100%" stopColor="#a05438"/>
                  </linearGradient>
                  <linearGradient id="h-leaf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6e57"/>
                    <stop offset="100%" stopColor="#12352a"/>
                  </linearGradient>
                  <radialGradient id="h-moon" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#fff4dc"/>
                    <stop offset="100%" stopColor="#d9b382"/>
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="400" height="600" fill="url(#h-sky)"/>
                <circle cx="200" cy="200" r="90" fill="url(#h-moon)" stroke="#1a1a18" strokeWidth="4"/>
                <path d="M0 380 Q 100 340 200 380 Q 300 420 400 380 L 400 600 L 0 600 Z"
                      fill="url(#h-leaf)" stroke="#1a1a18" strokeWidth="4"/>
                <g stroke="#1a1a18" strokeWidth="4" fill="none">
                  <line x1="0" y1="200" x2="400" y2="200"/>
                  <line x1="0" y1="380" x2="400" y2="380"/>
                  <line x1="200" y1="0" x2="200" y2="600"/>
                </g>
              </svg>
            </div>
            <div className={styles.glow} />
          </div>
        </div>
      </section>

            <section className={styles.quoteBand}>
        <div className={`container ${styles.quoteInner}`}>
          <div>
            <span className="eyebrow">Sur mesure</span>
            <h2>Un projet unique ?<br />Donnons-lui forme.</h2>
            <p>
              Nous concevons des vitraux sur mesure pour les particuliers, architectes
              et lieux de culte. Dessin, verres, sertissage, pose — nous vous accompagnons
              de la première esquisse à l'installation.
            </p>
          </div>
          <Button as={Link} to="/sur-mesure" variant="warm" size="lg">
            Demander un devis
          </Button>
        </div>
      </section>

      {/* ---------- Piliers ---------- */}
      <Section eyebrow="Le geste de l'atelier" title="Un savoir-faire, trois promesses">
        <div className={`${styles.pillars} anim-stagger`}>
          <article className={styles.pillar}>
            <span className={styles.pillarIcon}>✶</span>
            <h3>Verres d'origine</h3>
            <p>
              Verres antiques soufflés à la bouche, sélectionnés auprès de verreries
              françaises et allemandes reconnues.
            </p>
          </article>
          <article className={styles.pillar}>
            <span className={styles.pillarIcon}>⚒</span>
            <h3>Fait main à Metz</h3>
            <p>
              Chaque pièce est dessinée, découpée, sertie et soudée dans notre
              atelier, à la main, à l'ancienne.
            </p>
          </article>
          <article className={styles.pillar}>
            <span className={styles.pillarIcon}>❖</span>
            <h3>Pièces uniques</h3>
            <p>
              Aucune série. Nous créons en petites éditions ou sur commande,
              pour qu'aucune fenêtre ne se ressemble.
            </p>
          </article>
        </div>
      </Section>

      {/* ---------- Créations ---------- */}
      <Section
        eyebrow="Créations"
        title="Pièces disponibles"
        lead="Une sélection de nos vitraux et luminaires, prêts à rejoindre vos murs et vos fenêtres."
      >
        {loading
          ? <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>Chargement…</p>
          : <ProductGrid products={featured} />
        }
        <div className={styles.moreLink}>
          <Button as={Link} to="/boutique" variant="link" size="md">
            Voir toute la boutique →
          </Button>
        </div>
      </Section>
      {/* <BtnVitraux>
        Sur mesure
      </BtnVitraux>
      <BtnVitraux2>
        sur emsure
      </BtnVitraux2> */}

      {/* ---------- Bandeau sur-mesure ---------- */}
      {/* <section className={styles.quoteBand}>
        <div className={`container ${styles.quoteInner}`}>
          <div>
            <span className="eyebrow">Sur mesure</span>
            <h2>Un projet unique ?<br />Donnons-lui forme.</h2>
            <p>
              Nous concevons des vitraux sur mesure pour les particuliers, architectes
              et lieux de culte. Dessin, verres, sertissage, pose — nous vous accompagnons
              de la première esquisse à l'installation.
            </p>
          </div>
          <Button as={Link} to="/sur-mesure" variant="warm" size="lg">
            Demander un devis
          </Button>
        </div>
      </section> */}
    </>
  );
}
