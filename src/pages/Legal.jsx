import styles from './Legal.module.css';

const PAGES = {
  'mentions-legales': {
    title: 'Mentions légales',
    updated: 'Avril 2026',
    content: (
      <>
        <h2>Éditeur du site</h2>
        <p>
          Atelier Vitraux Lorrain — EURL au capital de 10 000 €.<br />
          Siège social : 12 rue des Jardiniers, 54000 Nancy, France.<br />
          SIRET : 000 000 000 00000 — N° TVA : FR00 000000000.
        </p>
        <h2>Directeur de la publication</h2>
        <p>Marie Durand, gérante.</p>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus (textes, images, dessins, photographies) est la
          propriété exclusive de l'Atelier Vitraux Lorrain. Toute reproduction,
          même partielle, sans autorisation écrite préalable est interdite.
        </p>
      </>
    ),
  },
  cgv: {
    title: 'Conditions générales de vente',
    updated: 'Avril 2026',
    content: (
      <>
        <h2>1. Objet</h2>
        <p>
          Les présentes CGV régissent les ventes de créations (panneaux, luminaires,
          médaillons) effectuées par l'Atelier Vitraux Lorrain auprès de
          particuliers et de professionnels.
        </p>
        <h2>2. Prix</h2>
        <p>
          Les prix sont indiqués en euros toutes taxes comprises, hors frais de
          livraison. L'atelier se réserve le droit de les modifier à tout moment.
        </p>
        <h2>3. Commande</h2>
        <p>
          Les commandes sont validées après paiement intégral via Stripe ou PayPal.
          Un email de confirmation est adressé à l'acheteur.
        </p>
        <h2>4. Livraison</h2>
        <p>
          Les pièces sont expédiées sous 5 à 7 jours ouvrés pour les articles en
          stock, emballées avec un soin particulier adapté à leur fragilité.
        </p>
        <h2>5. Droit de rétractation</h2>
        <p>
          Conformément au Code de la consommation, vous disposez de 14 jours pour
          vous rétracter, à l'exception des créations réalisées sur mesure.
        </p>
        <h2>6. Garanties</h2>
        <p>
          Nos pièces sont garanties 2 ans contre les défauts de fabrication.
          Merci de nous contacter en cas de problème : nous trouverons une solution.
        </p>
      </>
    ),
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    updated: 'Avril 2026',
    content: (
      <>
        <h2>Données collectées</h2>
        <p>
          Lors d'une commande, d'une demande de devis ou d'un message, nous
          collectons uniquement les informations strictement nécessaires
          (nom, email, adresse, téléphone).
        </p>
        <h2>Usage</h2>
        <p>
          Ces données servent exclusivement à traiter votre demande. Elles ne sont
          jamais revendues. Elles ne sont transmises qu'à nos prestataires de
          paiement (Stripe, PayPal) et de livraison.
        </p>
        <h2>Conservation</h2>
        <p>
          Les données liées à une commande sont conservées 10 ans pour des raisons
          légales et comptables.
        </p>
        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification
          et de suppression. Écrivez-nous à contact@vitraux-lorrain.fr.
        </p>
      </>
    ),
  },
};

export default function Legal({ slug }) {
  const page = PAGES[slug];
  if (!page) return null;

  return (
    <section className="section">
      <div className="container">
        <header className="section-title anim-fade-in-up">
          <span className="eyebrow">Informations</span>
          <h1>{page.title}</h1>
          <p className="lead">Dernière mise à jour : {page.updated}.</p>
        </header>

        <article className={styles.article}>{page.content}</article>
      </div>
    </section>
  );
}
