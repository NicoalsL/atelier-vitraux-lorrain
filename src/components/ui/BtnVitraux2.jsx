import { useState, useRef } from 'react';
import './BtnVitraux2.css';

// Couleurs verre cathédrale — toutes translucides pour simuler le verre teinté
const COLORS = [
  'rgba( 31,  78,  61, 0.88)',  // émeraude foncé
  'rgba( 47, 110,  87, 0.82)',  // émeraude
  'rgba(111, 165, 147, 0.78)',  // émeraude clair
  'rgba(201, 136,  58, 0.92)',  // or foncé
  'rgba(217, 168,  78, 0.88)',  // or
  'rgba(240, 208,  96, 0.82)',  // ambre clair
  'rgba( 30,  63, 122, 0.90)',  // cobalt foncé
  'rgba( 46, 109, 180, 0.85)',  // cobalt
  'rgba( 91, 155, 213, 0.78)',  // bleu ciel
  'rgba(139,  26,  26, 0.90)',  // rubis foncé
  'rgba(192,  57,  43, 0.85)',  // rubis
  'rgba( 94,  45, 142, 0.90)',  // violet cathédrale
  'rgba(155,  89, 182, 0.82)',  // mauve
  'rgba(255, 255, 255, 0.62)',  // éclat de lumière pure
  'rgba(255, 230, 160, 0.72)',  // lumière dorée
];

// Formes d'éclats de verre — toutes irrégulières, aucune symétrie
const SHAPES = [
  // Éclat fin vertical
  s => ({ width: `${s * 0.4}px`,  height: `${s * 3}px`,
          clipPath: 'polygon(28% 0%,72% 4%,68% 100%,32% 96%)' }),
  // Triangle irrégulier
  s => ({ width: `${s * 1.5}px`,  height: `${s * 1.2}px`,
          clipPath: 'polygon(0% 18%,100% 0%,82% 100%)' }),
  // Quadrilatère brisé
  s => ({ width: `${s * 1.3}px`,  height: `${s * 1.1}px`,
          clipPath: 'polygon(8% 0%,96% 10%,90% 90%,2% 100%)' }),
  // Losange asymétrique
  s => ({ width: `${s}px`,        height: `${s * 1.7}px`,
          clipPath: 'polygon(42% 0%,100% 28%,58% 100%,0% 72%)' }),
  // Éclat horizontal
  s => ({ width: `${s * 2.2}px`,  height: `${s * 0.55}px`,
          clipPath: 'polygon(0% 22%,100% 0%,96% 78%,4% 100%)' }),
  // Pentagonale tordue
  s => ({ width: `${s * 1.1}px`,  height: `${s * 1.3}px`,
          clipPath: 'polygon(15% 0%,90% 5%,100% 55%,60% 100%,0% 80%)' }),
];

function burst(el) {
  const cx = el.offsetWidth  / 2;
  const cy = el.offsetHeight / 2;
  const count = 9;

  for (let i = 0; i < count; i++) {
    const frag = document.createElement('span');
    frag.className = 'v2-frag';

    const angle   = (i / count) * 360 + (Math.random() * 10 - 5);
    const dist    = 18 + Math.random() * 18;
    const size    = 4 + Math.random() * 5;
    const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shapeFn = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const dur     = 550 + Math.random() * 250;

    // Propriétés CSS normales
    Object.assign(frag.style, {
      left:       `${cx}px`,
      top:        `${cy}px`,
      background: color,
      ...shapeFn(size),
    });

    // Variables CSS custom : OBLIGATOIREMENT via setProperty
    frag.style.setProperty('--dx',  `${Math.cos((angle * Math.PI) / 180) * dist}px`);
    frag.style.setProperty('--dy',  `${Math.sin((angle * Math.PI) / 180) * dist}px`);
    frag.style.setProperty('--rot', `${Math.random() * 400 - 200}deg`);
    frag.style.setProperty('--dur', `${dur}ms`);

    el.appendChild(frag);
    setTimeout(() => frag.remove(), dur + 80);
  }

  // Ripple d'onde
  const ripple = document.createElement('span');
  ripple.className = 'v2-ripple';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 620);
}

export default function BtnVitraux2({
  children       = "S'abonner",
  subscribedText = 'Abonné',
  onToggle,
  defaultOn = false,
  className = '',
  ...rest
}) {
  const [on,       setOn]       = useState(defaultOn);
  const [bursting, setBursting] = useState(false);
  const ref = useRef(null);

  const handleClick = () => {
    if (bursting) return;
    setBursting(true);
    burst(ref.current);

    setTimeout(() => {
      const next = !on;
      setOn(next);
      setBursting(false);
      onToggle?.(next);
    }, 310);
  };

  return (
    <button
      ref={ref}
      className={[
        'btn-v2',
        on       ? 'btn-v2--on'    : '',
        bursting ? 'btn-v2--burst' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      aria-pressed={on}
      {...rest}
    >
      {/* Rayon lumineux traversant */}
      <span className="v2-ray" aria-hidden="true" />

      {/* Halo de lumière diffuse */}
      <span className="v2-glow" aria-hidden="true" />

      {/* Texte */}
      <span className="v2-label">
        {on ? (
          <>
            <span className="v2-star" aria-hidden="true">✦</span>
            {subscribedText}
          </>
        ) : children}
      </span>
    </button>
  );
}
