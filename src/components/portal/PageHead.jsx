export default function PageHead({ title, sub, children }) {
  return (
    <header className="ph">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {children && <div className="acts">{children}</div>}
    </header>
  );
}
