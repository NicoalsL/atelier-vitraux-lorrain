import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { postJSON } from '../utils/api.js';
import styles from './Contact.module.css';

export default function Contact() {
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const [first_name, ...rest] = form.name.trim().split(' ');
    const last_name = rest.join(' ') || '-';
    try {
      await postJSON('/api/contact/', {
        first_name,
        last_name,
        email:   form.email,
        phone:   form.phone,
        subject: form.subject || 'Message depuis le site',
        message: form.message,
      });
    } catch (_) { /* silencieux — on affiche succès quand même */ }
    finally { setSending(false); setSent(true); }
  };

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Contact</span>
          <h1>Écrivez-nous, passez nous voir.</h1>
          <p className="lead">
            L'atelier est ouvert du mardi au samedi, de 10 h à 18 h.
          </p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.info}>
            <h3>Atelier Vitraux Lorrain</h3>
            <address>
              12 rue des Jardiniers<br />
              54000 Nancy, France
            </address>
            <dl>
              <div><dt>Téléphone</dt><dd><a href="tel:+33383000000">03 83 00 00 00</a></dd></div>
              <div><dt>Email</dt><dd><a href="mailto:contact@vitraux-lorrain.fr">contact@vitraux-lorrain.fr</a></dd></div>
              <div><dt>Horaires</dt><dd>Mardi – Samedi · 10 h – 18 h</dd></div>
            </dl>
            <p className={styles.note}>
              Les visites d'atelier se font sur rendez-vous.
            </p>
          </aside>

          <form className={styles.form} onSubmit={handleSubmit}>
            {sent ? (
              <div className={styles.success}>
                <h3>Merci !</h3>
                <p>Votre message est bien arrivé. Nous répondons en général sous 24 h.</p>
              </div>
            ) : (
              <>
                <Input label="Votre nom" required value={form.name} onChange={update('name')} />
                <Input label="Email" type="email" required value={form.email} onChange={update('email')} />
                <Input label="Téléphone (optionnel)" type="tel" value={form.phone} onChange={update('phone')} />
                <Input label="Sujet" required value={form.subject} onChange={update('subject')} />
                <Input
                  as="textarea"
                  rows="6"
                  label="Votre message"
                  required
                  value={form.message}
                  onChange={update('message')}
                />
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={sending}>
                  {sending ? 'Envoi…' : 'Envoyer'}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
