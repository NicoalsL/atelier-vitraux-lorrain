import { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Lightbox.module.css';

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoom,  setZoom]  = useState(false);
  const wrapRef = useRef(null);

  const prev = useCallback(() => { setIndex(i => (i - 1 + images.length) % images.length); setZoom(false); }, [images.length]);
  const next = useCallback(() => { setIndex(i => (i + 1) % images.length); setZoom(false); }, [images.length]);

  useEffect(() => { setIndex(startIndex); setZoom(false); }, [startIndex]);

  // Centre le scroll après zoom
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !zoom) return;
    requestAnimationFrame(() => {
      el.scrollLeft = (el.scrollWidth  - el.clientWidth)  / 2;
      el.scrollTop  = (el.scrollHeight - el.clientHeight) / 2;
    });
  }, [zoom]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')     { zoom ? setZoom(false) : onClose(); }
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next, zoom]);

  const current = images[index];

  // Clic sur le fond (pas sur l'image) : quitte le zoom ou ferme
  const handleWrapClick = () => {
    if (zoom) setZoom(false);
    else onClose();
  };

  return createPortal(
    <div className={styles.overlay}>

      {/* Barre du haut */}
      <div className={styles.topBar}>
        <span className={styles.counter}>{index + 1} / {images.length}</span>
        <button className={styles.zoomBtn} onClick={() => setZoom(z => !z)} title={zoom ? 'Réduire' : 'Agrandir'}>
          {zoom ? '⊖' : '⊕'}
        </button>
        <button className={styles.closeBtn} onClick={onClose} title="Fermer (Échap)">✕</button>
      </div>

      {/* Zone image */}
      <div
        ref={wrapRef}
        className={`${styles.imgWrap} ${zoom ? styles.imgWrapZoom : ''}`}
        onClick={handleWrapClick}
      >
        {images.length > 1 && !zoom && (
          <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={e => { e.stopPropagation(); prev(); }} aria-label="Précédente">‹</button>
        )}

        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          className={`${styles.img} ${zoom ? styles.imgZoomed : ''}`}
          onClick={e => { e.stopPropagation(); setZoom(z => !z); }}
          draggable={false}
        />

        {images.length > 1 && !zoom && (
          <button className={`${styles.navBtn} ${styles.navNext}`} onClick={e => { e.stopPropagation(); next(); }} aria-label="Suivante">›</button>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
              onClick={() => { setIndex(i); setZoom(false); }}
            >
              <img src={img.src} alt={img.alt} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
