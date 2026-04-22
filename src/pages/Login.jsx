import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import styles from './Login.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || '/mon-compte';

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.detail || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.sub}>Bienvenue dans votre espace personnel.</p>

        <form onSubmit={submit} className={styles.form} noValidate>
          <label className={styles.label}>
            Adresse e-mail
            <input
              type="email" name="email" required
              value={form.email} onChange={handle}
              className={styles.input}
              autoComplete="email"
            />
          </label>

          <label className={styles.label}>
            Mot de passe
            <input
              type="password" name="password" required
              value={form.password} onChange={handle}
              className={styles.input}
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className={styles.footer}>
          Pas encore de compte ?{' '}
          <Link to="/inscription" className={styles.footerLink}>Créer un compte</Link>
        </p>
      </div>
    </main>
  );
}
