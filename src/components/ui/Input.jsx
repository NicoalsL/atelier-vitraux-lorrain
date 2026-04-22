import { forwardRef, useId } from 'react';
import styles from './Input.module.css';

/**
 * Input élégant avec label flottant.
 * Fonctionne pour input et textarea (as="textarea").
 */
const Input = forwardRef(function Input(
  { as = 'input', label, error, hint, className = '', id, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id || autoId;
  const Tag = as;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''} ${className}`}>
      <Tag
        ref={ref}
        id={fieldId}
        className={styles.control}
        placeholder=" "
        {...rest}
      />
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
      )}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});

export default Input;
