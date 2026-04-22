import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop.jsx';
import PageProgress from '../components/PageProgress.jsx';
import PageTransition from '../components/PageTransition.jsx';
import Home from '../pages/Home.jsx';
import Catalog from '../pages/Catalog.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import About from '../pages/About.jsx';
import Quote from '../pages/Quote.jsx';
import Contact from '../pages/Contact.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Confirmation from '../pages/Confirmation.jsx';
import Legal from '../pages/Legal.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Account from '../pages/Account.jsx';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <PageProgress />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boutique" element={<Catalog />} />
          <Route path="/produit/:slug" element={<ProductDetail />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/sur-mesure" element={<Quote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/paiement" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mon-compte" element={<Account />} />
          <Route path="/mentions-legales" element={<Legal slug="mentions-legales" />} />
          <Route path="/cgv" element={<Legal slug="cgv" />} />
          <Route path="/confidentialite" element={<Legal slug="confidentialite" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </>
  );
}
