import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageProgress.module.css';

export default function PageProgress() {
  const { pathname } = useLocation();
  const [active, setActive]     = useState(false);
  const [width,  setWidth]      = useState(0);
  const timerRef = useRef(null);
  const growRef  = useRef(null);

  useEffect(() => {
    // Démarre la barre
    setWidth(0);
    setActive(true);

    timerRef.current = setTimeout(() => setWidth(70), 10);
    growRef.current  = setTimeout(() => setWidth(90), 400);

    // Termine après un court délai (simule la fin du chargement)
    const done = setTimeout(() => {
      setWidth(100);
      setTimeout(() => setActive(false), 300);
    }, 600);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(growRef.current);
      clearTimeout(done);
    };
  }, [pathname]);

  if (!active && width === 0) return null;

  return (
    <div
      className={styles.bar}
      style={{
        width:   `${width}%`,
        opacity: active ? 1 : 0,
      }}
    />
  );
}
