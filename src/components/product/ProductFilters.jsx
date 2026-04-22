import Input from '../ui/Input.jsx';
import styles from './ProductFilters.module.css';

export default function ProductFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
  priceCap,
  categories = [],
}) {
  return (
    <aside className={styles.filters}>
      <div className={styles.block}>
        <label className={styles.title}>Recherche</label>
        <Input
          type="search"
          label="Rechercher une création"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <div className={styles.block}>
        <span className={styles.title}>Catégories</span>
        <div className={styles.chips} role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            className={`${styles.chip} ${category === 'all' ? styles.chipActive : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            Toutes
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`${styles.chip} ${category === c.slug ? styles.chipActive : ''}`}
              onClick={() => onCategoryChange(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <label className={styles.title} htmlFor="price-slider">
          Prix max&nbsp;: {maxPrice} €
        </label>
        <input
          id="price-slider"
          type="range"
          min={100}
          max={priceCap}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className={styles.range}
        />
      </div>
    </aside>
  );
}
