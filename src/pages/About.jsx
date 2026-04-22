import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';
import styles from './About.module.css';

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container">
          <header className="section-title anim-fade-in-up">
            <span className="eyebrow">L'atelier</span>
            <h1>Un geste patient, une lumière qui dure.</h1>
            <p className="lead">
              Depuis 1987, l'Atelier Vitraux Lorrain perpétue l'art du vitrail au cœur
              de Nancy. Trois générations d'artisans, un seul objectif : faire vivre
              la lumière dans vos intérieurs.
            </p>
          </header>

          <div className={styles.twoCols}>
            <div className={styles.copy}>
              <h2>Un savoir-faire hérité de l'École de Nancy</h2>
              <p>
                Nous nous inscrivons dans la lignée des grands verriers lorrains,
                Daum, Gallé, Gruber — tout en assumant une sensibilité contemporaine.
                Nos créations marient le verre antique soufflé, le plomb laminé et
                le ruban de cuivre Tiffany.
              </p>
              <p>
                Chaque pièce commence par un dessin à la main, grandeur nature. Puis
                viennent la sélection des verres, la coupe au diamant, le sertissage
                et la soudure. Rien n'est industrialisé. Tout est pensé pour durer.
              </p>
            </div>

            <div className={styles.steps}>
              {[
                { n: '01', t: 'Dessin', d: 'Esquisse à la main, puis maquette grandeur nature.' },
                { n: '02', t: 'Sélection', d: 'Verres antiques soufflés, choisis en lumière.' },
                { n: '03', t: 'Coupe', d: 'Chaque pièce est taillée au diamant, à la main.' },
                { n: '04', t: 'Sertissage', d: 'Plomb patiné ou ruban de cuivre étamé.' },
                { n: '05', t: 'Finition', d: 'Masticage, nettoyage, et signature de l\'atelier.' },
              ].map((s) => (
                <div key={s.n} className={styles.step}>
                  <span className={styles.stepN}>{s.n}</span>
                  <div>
                    <h4>{s.t}</h4>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Chiffres" title="L'atelier en quelques repères">
        <div className={styles.stats}>
          <div><strong>38</strong><span>années d'existence</span></div>
          <div><strong>+240</strong><span>pièces uniques créées</span></div>
          <div><strong>3</strong><span>générations d'artisans</span></div>
          <div><strong>100 %</strong><span>fabriqué à Nancy</span></div>
        </div>
      </Section>

      <section className={styles.cta}>
        <div className="container">
          <h2>Un lieu, une visite, un projet ?</h2>
          <p>L'atelier se visite sur rendez-vous, rue des Jardiniers, à Nancy.</p>
          <Button as={Link} to="/contact" variant="primary" size="lg">
            Prendre rendez-vous
          </Button>
        </div>
      </section>
    </>
  );
}
