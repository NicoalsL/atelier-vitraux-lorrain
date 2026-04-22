export default function Section({ eyebrow, title, lead, children, id }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        {(eyebrow || title || lead) && (
          <header className="section-title anim-fade-in-up">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
