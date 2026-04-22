import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import styles from './Register.module.css';

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', password: '', password2: '' };

function pwdStrength(pwd) {
  return {
    hasUpper:   /[A-Z]/.test(pwd),
    hasDigit:   /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd),
  };
}

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const strength = pwdStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!strength.hasUpper || !strength.hasDigit || !strength.hasSpecial) {
      setErrors({ password: 'Le mot de passe doit contenir une majuscule, un chiffre et un signe spécial.' });
      return;
    }
    if (form.password !== form.password2) {
      setErrors({ password2: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/mon-compte', { replace: true });
    } catch (err) {
      setErrors(err || { non_field_errors: 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', autocomplete) => (
    <label className={styles.label}>
      {label}
      <input
        type={type} name={name} value={form[name]}
        onChange={handle} className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
        autoComplete={autocomplete}
      />
      {errors[name] && <span className={styles.fieldError}>{errors[name]}</span>}
    </label>
  );

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Créer un compte</h1>
        <p className={styles.sub}>Suivez vos commandes et gérez vos devis en un clic.</p>

        <form onSubmit={submit} className={styles.form} noValidate>
          <div className={styles.row}>
            {field('first_name', 'Prénom', 'text', 'given-name')}
            {field('last_name',  'Nom',    'text', 'family-name')}
          </div>
          {field('email', 'Adresse e-mail', 'email', 'email')}
          {field('phone', 'Téléphone (optionnel)', 'tel', 'tel')}
          <div>
            {field('password', 'Mot de passe', 'password', 'new-password')}
            {form.password.length > 0 && (
              <ul className={styles.pwdHints}>
                <li className={strength.hasUpper   ? styles.ok : styles.ko}>Majuscule (A–Z)</li>
                <li className={strength.hasDigit   ? styles.ok : styles.ko}>Chiffre (0–9)</li>
                <li className={strength.hasSpecial ? styles.ok : styles.ko}>Signe spécial (!@#…)</li>
              </ul>
            )}
          </div>
          {field('password2', 'Confirmer le mot de passe', 'password', 'new-password')}

          {errors.non_field_errors && (
            <p className={styles.error}>{errors.non_field_errors}</p>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className={styles.footer}>
          Déjà client ?{' '}
          <Link to="/connexion" className={styles.footerLink}>Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
