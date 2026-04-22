import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CookieBanner from '../ui/CookieBanner.jsx';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
