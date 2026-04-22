import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useWishlist } from '../hooks/useWishlist.js';
import { formatPrice } from '../utils/format.js';
import styles from './Account.module.css';

const STATUS_LABEL = {
  pending:    'En attente',
  paid:       'Payé',
  processing: 'En cours',
  shipped:    'Expédié',
  delivered:  'Livré',
  cancelled:  'Annulé',
  refunded:   'Remboursé',
};

const LOYALTY_TIERS = [
  { label: 'Artisan',    min: 0,    color: '#8c7c6a' },
  { label: 'Verrier',    min: 500,  color: '#2e6db4' },
  { label: 'Maître',     min: 2000, color: '#1e7e34' },
  { label: 'Compagnon',  min: 5000, color: '#d4a017' },
];

function getTier(points) {
  return [...LOYALTY_TIERS].reverse().find(t => points >= t.min) || LOYALTY_TIERS[0];
}

// ── Onglet Profil ──────────────────────────────────────────
function TabProfile({ user, updateProfile }) {
  const [form,   setForm]   = useState({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await updateProfile(form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (_) {}
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className={styles.title}>Mon profil</h1>
      <form onSubmit={save} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>Prénom
            <input name="first_name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={styles.input} />
          </label>
          <label className={styles.label}>Nom
            <input name="last_name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={styles.input} />
          </label>
        </div>
        <label className={styles.label}>E-mail
          <input value={user.email} disabled className={`${styles.input} ${styles.inputDisabled}`} />
        </label>
        <label className={styles.label}>Téléphone
          <input name="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={styles.input} />
        </label>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {saved && <span className={styles.savedMsg}>Profil mis à jour !</span>}
        </div>
      </form>
    </div>
  );
}

// ── Onglet Commandes ───────────────────────────────────────
function TabOrders({ accessToken }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/me/', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div>
      <h1 className={styles.title}>Mes commandes</h1>
      {loading && <p className={styles.empty}>Chargement…</p>}
      {!loading && orders.length === 0 && <p className={styles.empty}>Aucune commande pour le moment.</p>}
      {orders.map(order => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHead}>
            <span className={styles.orderRef}>{order.reference}</span>
            <span className={`${styles.orderStatus} ${styles[`status_${order.status}`]}`}>
              {STATUS_LABEL[order.status] || order.status}
            </span>
            <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <ul className={styles.orderItems}>
            {order.items.map((item, i) => (
              <li key={i} className={styles.orderItem}>
                <span>{item.product_name}</span>
                <span>×{item.quantity}</span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          {order.promo_code && (
            <p className={styles.orderPromo}>Code promo appliqué : <strong>{order.promo_code}</strong> (−{formatPrice(order.discount)})</p>
          )}
          <div className={styles.orderTotal}>Total : <strong>{formatPrice(order.total)}</strong></div>
        </div>
      ))}
    </div>
  );
}

// ── Onglet Favoris ─────────────────────────────────────────
function TabWishlist({ accessToken }) {
  const { toggle } = useWishlist();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch('/api/wishlist/', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const remove = async (product) => {
    await toggle(product);
    setItems(prev => prev.filter(i => i.product.id !== product.id));
  };

  return (
    <div>
      <h1 className={styles.title}>Mes favoris</h1>
      {loading && <p className={styles.empty}>Chargement…</p>}
      {!loading && items.length === 0 && (
        <p className={styles.empty}>
          Aucun favori pour l'instant.{' '}
          <Link to="/boutique" className={styles.link}>Découvrir la boutique →</Link>
        </p>
      )}
      <div className={styles.wishGrid}>
        {items.map(item => (
          <div key={item.id} className={styles.wishCard}>
            <Link to={`/produit/${item.product.slug}`} className={styles.wishImg}>
              <img src={item.product.thumbnail} alt={item.product.name} />
            </Link>
            <div className={styles.wishInfo}>
              <Link to={`/produit/${item.product.slug}`} className={styles.wishName}>{item.product.name}</Link>
              <span className={styles.wishPrice}>{formatPrice(item.product.price)}</span>
              <button className={styles.wishRemove} onClick={() => remove(item.product)}>Retirer ♥</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Onglet Adresses ────────────────────────────────────────
const EMPTY_ADDR = { label: '', first_name: '', last_name: '', address: '', city: '', zip_code: '', country: 'FR', phone: '', is_default: false };

function TabAddresses({ accessToken }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_ADDR);
  const [saving, setSaving]       = useState(false);

  const load = () => {
    fetch('/api/auth/addresses/', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [accessToken]);

  const openNew   = () => { setEditing('new'); setForm(EMPTY_ADDR); };
  const openEdit  = (addr) => { setEditing(addr.id); setForm(addr); };
  const cancelEdit = () => { setEditing(null); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const isNew = editing === 'new';
    const r = await fetch(isNew ? '/api/auth/addresses/' : `/api/auth/addresses/${editing}/`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (r.ok) { setEditing(null); load(); }
  };

  const remove = async (id) => {
    await fetch(`/api/auth/addresses/${id}/`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
    load();
  };

  return (
    <div>
      <div className={styles.sectionHead}>
        <h1 className={styles.title}>Mes adresses</h1>
        {editing === null && (
          <button className={styles.saveBtn} onClick={openNew}>+ Ajouter</button>
        )}
      </div>

      {loading && <p className={styles.empty}>Chargement…</p>}
      {!loading && addresses.length === 0 && editing === null && (
        <p className={styles.empty}>Aucune adresse sauvegardée.</p>
      )}

      {editing !== null && (
        <form onSubmit={save} className={`${styles.form} ${styles.addrForm}`}>
          <label className={styles.label}>Libellé (ex : Domicile)
            <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={styles.input} placeholder="Domicile, Bureau…" />
          </label>
          <div className={styles.row}>
            <label className={styles.label}>Prénom
              <input required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={styles.input} />
            </label>
            <label className={styles.label}>Nom
              <input required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={styles.input} />
            </label>
          </div>
          <label className={styles.label}>Adresse
            <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={styles.input} />
          </label>
          <div className={styles.row}>
            <label className={styles.label}>Code postal
              <input required value={form.zip_code} onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))} className={styles.input} />
            </label>
            <label className={styles.label}>Ville
              <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={styles.input} />
            </label>
          </div>
          <label className={styles.label}>Téléphone
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={styles.input} />
          </label>
          <label className={`${styles.label} ${styles.labelCheck}`}>
            <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
            Adresse par défaut
          </label>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? 'Enregistrement…' : 'Sauvegarder'}</button>
            <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>Annuler</button>
          </div>
        </form>
      )}

      <div className={styles.addrList}>
        {addresses.map(addr => (
          <div key={addr.id} className={`${styles.addrCard} ${addr.is_default ? styles.addrDefault : ''}`}>
            {addr.is_default && <span className={styles.addrBadge}>Par défaut</span>}
            {addr.label && <strong className={styles.addrLabel}>{addr.label}</strong>}
            <p className={styles.addrText}>
              {addr.first_name} {addr.last_name}<br />
              {addr.address}<br />
              {addr.zip_code} {addr.city}, {addr.country}
              {addr.phone && <><br />{addr.phone}</>}
            </p>
            <div className={styles.addrActions}>
              <button className={styles.addrBtn} onClick={() => openEdit(addr)}>Modifier</button>
              <button className={`${styles.addrBtn} ${styles.addrBtnDanger}`} onClick={() => remove(addr.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Onglet Mot de passe ────────────────────────────────────
function TabPassword({ accessToken }) {
  const [form,   setForm]   = useState({ old_password: '', new_password: '', new_password2: '' });
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [err,    setErr]    = useState('');

  const save = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (form.new_password !== form.new_password2) { setErr('Les mots de passe ne correspondent pas.'); return; }
    setSaving(true);
    const r = await fetch('/api/auth/change-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ old_password: form.old_password, new_password: form.new_password }),
    });
    setSaving(false);
    if (r.ok) { setMsg('Mot de passe modifié avec succès.'); setForm({ old_password: '', new_password: '', new_password2: '' }); }
    else { const data = await r.json(); setErr(data.old_password?.[0] || data.detail || 'Une erreur est survenue.'); }
  };

  const field = (key, label, hint) => (
    <label className={styles.label}>{label}
      <input type="password" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className={styles.input} required />
      {hint && <small className={styles.fieldHint}>{hint}</small>}
    </label>
  );

  return (
    <div>
      <h1 className={styles.title}>Modifier le mot de passe</h1>
      <form onSubmit={save} className={styles.form}>
        {field('old_password',  'Mot de passe actuel')}
        {field('new_password',  'Nouveau mot de passe', 'Au moins 8 caractères, une majuscule, un chiffre, un signe spécial.')}
        {field('new_password2', 'Confirmer le nouveau mot de passe')}
        {err && <p className={styles.errorMsg}>{err}</p>}
        {msg && <p className={styles.savedMsg}>{msg}</p>}
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>{saving ? 'Modification…' : 'Changer le mot de passe'}</button>
        </div>
      </form>
    </div>
  );
}

// ── Onglet Fidélité ────────────────────────────────────────
function TabLoyalty({ user }) {
  const points = user.loyalty_points ?? 0;
  const tier   = getTier(points);
  const nextTier = LOYALTY_TIERS.find(t => t.min > points);
  const prevMin  = tier.min;
  const nextMin  = nextTier?.min ?? prevMin + 1;
  const progress = nextTier ? Math.min(100, ((points - prevMin) / (nextMin - prevMin)) * 100) : 100;

  return (
    <div>
      <h1 className={styles.title}>Programme fidélité</h1>

      <div className={styles.loyaltyCard}>
        <div className={styles.loyaltyBadge} style={{ background: tier.color }}>
          <span className={styles.loyaltyTier}>{tier.label}</span>
          <span className={styles.loyaltyPoints}>{points.toLocaleString('fr-FR')} pts</span>
        </div>

        <div className={styles.loyaltyProgress}>
          <div className={styles.loyaltyBar}>
            <div className={styles.loyaltyFill} style={{ width: `${progress}%`, background: tier.color }} />
          </div>
          {nextTier
            ? <p className={styles.loyaltyNext}>Plus que <strong>{(nextMin - points).toLocaleString('fr-FR')} pts</strong> pour atteindre le niveau <strong>{nextTier.label}</strong></p>
            : <p className={styles.loyaltyNext}>Vous avez atteint le niveau maximum ✦</p>}
        </div>

        <div className={styles.loyaltyInfo}>
          <p>Vous gagnez <strong>10 points</strong> par euro dépensé sur vos commandes.</p>
        </div>
      </div>

      <h2 className={styles.subtitle}>Avantages membres</h2>
      <ul className={styles.perks}>
        <li className={styles.perk}><span className={styles.perkIcon}>📦</span><div><strong>Livraison offerte</strong><p>Dès 200 € d'achats cumulés</p></div></li>
        <li className={styles.perk}><span className={styles.perkIcon}>🎁</span><div><strong>Offres exclusives</strong><p>Codes promo réservés aux membres connectés</p></div></li>
        <li className={styles.perk}><span className={styles.perkIcon}>⭐</span><div><strong>Avis prioritaires</strong><p>Vos avis influencent nos créations futures</p></div></li>
        <li className={styles.perk}><span className={styles.perkIcon}>📋</span><div><strong>Suivi de commande</strong><p>Historique complet et statuts en temps réel</p></div></li>
        <li className={styles.perk}><span className={styles.perkIcon}>📍</span><div><strong>Adresses sauvegardées</strong><p>Checkout plus rapide à chaque commande</p></div></li>
        <li className={styles.perk}><span className={styles.perkIcon}>♥</span><div><strong>Liste de favoris</strong><p>Retrouvez facilement vos créations préférées</p></div></li>
      </ul>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────
export default function Account() {
  const { user, accessToken, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (!user) navigate('/connexion', { state: { from: '/mon-compte' } });
  }, [user]); // eslint-disable-line

  if (!user) return null;

  const NAV = [
    { id: 'profile',   label: 'Mon profil' },
    { id: 'orders',    label: 'Mes commandes' },
    { id: 'wishlist',  label: 'Mes favoris' },
    { id: 'addresses', label: 'Mes adresses' },
    { id: 'password',  label: 'Mot de passe' },
    { id: 'loyalty',   label: '✦ Fidélité' },
  ];

  return (
    <main className={styles.page}>
      <div className={`container ${styles.wrapper}`}>
        <aside className={styles.sidebar}>
          <div className={styles.avatar}>
            {(user.first_name?.[0] || user.email[0]).toUpperCase()}
          </div>
          <p className={styles.avatarName}>{user.first_name} {user.last_name}</p>
          <p className={styles.avatarEmail}>{user.email}</p>
          {user.loyalty_points != null && (
            <span className={styles.pointsBadge} style={{ background: getTier(user.loyalty_points).color }}>
              {getTier(user.loyalty_points).label} · {user.loyalty_points.toLocaleString('fr-FR')} pts
            </span>
          )}

          <nav className={styles.nav}>
            {NAV.map(n => (
              <button
                key={n.id}
                className={`${styles.navBtn} ${tab === n.id ? styles.active : ''}`}
                onClick={() => setTab(n.id)}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <button className={styles.logoutBtn} onClick={async () => { await logout(); navigate('/'); }}>
            Se déconnecter
          </button>
        </aside>

        <section className={styles.content}>
          {tab === 'profile'   && <TabProfile user={user} updateProfile={updateProfile} />}
          {tab === 'orders'    && <TabOrders accessToken={accessToken} />}
          {tab === 'wishlist'  && <TabWishlist accessToken={accessToken} />}
          {tab === 'addresses' && <TabAddresses accessToken={accessToken} />}
          {tab === 'password'  && <TabPassword accessToken={accessToken} />}
          {tab === 'loyalty'   && <TabLoyalty user={user} />}
        </section>
      </div>
    </main>
  );
}
