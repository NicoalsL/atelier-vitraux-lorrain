import { forwardRef } from 'react';
import './btn_vitraux.css';

const BtnVitraux = forwardRef(function BtnVitraux(
  {
    as: Tag = 'button',
    children,
    className = '',
    disabled = false,
    ...rest
  },
  ref
) {
  const handleClick = (e) => {
    const el = e.currentTarget;
    el.classList.add('clicked');
    setTimeout(() => el.classList.remove('clicked'), 250);
  };

  return (
    <Tag
      ref={ref}
      className={`btn_vitraux ${className}`}
      disabled={Tag === 'button' ? disabled : undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="vitraux-light" />
      <span className="vitraux-content">{children}</span>
    </Tag>
  );
});

export default BtnVitraux;