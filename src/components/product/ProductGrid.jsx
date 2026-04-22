import ProductCard from './ProductCard.jsx';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products, empty = 'Aucune création ne correspond.' }) {
  if (!products || products.length === 0) {
    return <p className={styles.empty}>{empty}</p>;
  }
  return (
    <div className={`${styles.grid} anim-stagger`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
