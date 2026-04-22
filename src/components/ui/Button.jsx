import { forwardRef } from 'react';
import styles from './Button.module.css';

/**
 * Bouton premium avec micro-interactions :
 *  - shine diagonal au hover
 *  - compression douce au click
 *  - icône animée
 *  - ripple subtil
 *
 * Variantes :
 *  - primary  : émeraude, action principale
 *  - warm     : terracotta, appels chaleureux (ajout panier...)
 *  - ghost    : fond transparent, bord fin
 *  - link     : texte seul avec soulignement animé
 *
 * Tailles : sm | md | lg
 */
const Button = forwardRef(function Button(
  {
    as: Tag = 'button',
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    fullWidth = false,
    loading = false,
    disabled = false,
    className = '',
    children,
    ...rest
  },
  ref
) {
  const classes = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className={styles.shine} aria-hidden="true" />
      <span className={styles.content}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <span className={styles.label}>{children}</span>
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </span>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
