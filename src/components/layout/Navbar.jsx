import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './Navbar.module.css';

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/boutique', label: 'Boutique' },
  { to: '/sur-mesure', label: 'Sur mesure' },
  { to: '/a-propos', label: 'Atelier' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermer le menu mobile à chaque changement de route
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} aria-label="Atelier Vitraux Lorrain — Accueil">
          <svg className={styles.brandMark} viewBox="0 0 48 48" aria-hidden="true">
            <defs>
              <linearGradient id="nav-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1f4e3d"/>
                <stop offset="60%" stopColor="#c97b5a"/>
                <stop offset="100%" stopColor="#d9b382"/>
              </linearGradient>
            </defs>
            <path d="M24 4 L42 24 L24 44 L6 24 Z" fill="url(#nav-g)"/>
            <path d="M24 4 L42 24 L24 44 L6 24 Z" fill="none" stroke="#1a1a18" strokeWidth="1.2"/>
            <line x1="6" y1="24" x2="42" y2="24" stroke="#1a1a18" strokeWidth="1.2"/>
            <line x1="24" y1="4" x2="24" y2="44" stroke="#1a1a18" strokeWidth="1.2"/>
          </svg>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Atelier Vitraux Lorrain</span>
            <span className={styles.brandSub}>Depuis 1987 · Nancy</span>
          </span>
        </Link>

        <nav className={`${styles.links} ${open ? styles.open : ''}`} aria-label="Navigation principale">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/mon-compte" className={styles.userBtn} title={user.email}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                </svg>
                <span className={styles.userLabel}>{user.first_name || 'Mon compte'}</span>
              </Link>
            </div>
          ) : (
            <Link to="/connexion" className={styles.loginBtn}>
              Connexion
            </Link>
          )}

          <Link to="/panier" className={styles.cartBtn} aria-label={`Panier (${count} articles)`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="21" r="1.4"/>
              <circle cx="18" cy="21" r="1.4"/>
            </svg>
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </Link>

          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
