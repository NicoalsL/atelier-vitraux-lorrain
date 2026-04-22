import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { postJSON } from '../utils/api.js';
import styles from './Quote.module.css';

const PROJECT_TYPES = [
  { label: 'Panneau décoratif',    value: 'panneau' },
  { label: 'Fenêtre / imposte',    value: 'vitrail' },
  { label: 'Luminaire sur mesure', value: 'luminaire' },
  { label: 'Restauration',         value: 'restauration' },
  { label: 'Autre',                value: 'autre' },
];

export default function Quote() {
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    project_type: PROJECT_TYPES[0].value,
    budget: '',
    description: '',
    dimensions: '',
    timeline: '',
  });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await postJSON('/api/quotes/', form);
    } catch (_) { /* silencieux */ }
    finally { setSending(false); setSent(true); }
  };

  if (sent) {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.success}>
            <span className={styles.checkmark}>✓</span>
            <h1>Merci, votre demande nous est parvenue.</h1>
            <p>Nous revenons vers vous sous 48 h ouvrées avec une première piste d'estimation.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Sur mesure</span>
          <h1>Demande de devis</h1>
          <p className="lead">
            Décrivez-nous votre projet : nous vous proposerons une première esquisse
            et une estimation personnalisée sous 48 h.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row2}>
            <Input label="Prénom" required value={form.first_name} onChange={update('first_name')} />
            <Input label="Nom"    required value={form.last_name}  onChange={update('last_name')} />
          </div>
          <div className={styles.row2}>
            <Input label="Email" type="email" required value={form.email} onChange={update('email')} />
            <Input label="Téléphone (optionnel)" value={form.phone} onChange={update('phone')} />
          </div>
          <div className={styles.row2}>
            <div className={styles.select}>
              <label htmlFor="project_type">Nature du projet</label>
              <select id="project_type" value={form.project_type} onChange={update('project_type')}>
                {PROJECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Input label="Délai souhaité" value={form.timeline} onChange={update('timeline')} hint="Ex : avant juin 2025" />
          </div>

          <div className={styles.row2}>
            <Input label="Dimensions approximatives" value={form.dimensions} onChange={update('dimensions')} hint="Ex : 80 × 120 cm" />
            <Input label="Budget envisagé (€)" type="number" min="0" value={form.budget} onChange={update('budget')} />
          </div>

          <Input
            as="textarea"
            rows="6"
            label="Décrivez votre projet"
            value={form.description}
            onChange={update('description')}
            required
            hint="Style, couleurs, ambiance, contraintes, délais…"
          />

          <div className={styles.actions}>
            <Button type="submit" variant="primary" size="lg" disabled={sending}>
              {sending ? 'Envoi…' : 'Envoyer ma demande'}
            </Button>
            <p className={styles.legal}>
              Vos informations ne seront utilisées que pour traiter votre demande.
              Voir notre <a href="/confidentialite">politique de confidentialité</a>.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
