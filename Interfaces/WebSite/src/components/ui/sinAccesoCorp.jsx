import "./acceso.css";

export default function SinAcceso() {
  return (
    <main className="content acceso-main">
      <div className="acceso-container">
        <div className="acceso-card">
          <div className="acceso-icon">
            <span>⚠️</span>
          </div>
          <h2 className="acceso-title">Acceso Denegado</h2>
          <p className="acceso-text">
            Lo sentimos, usted es Corporativo y no tiene acceso a este apartado.
          </p>

        </div>
      </div>
    </main>
  );
}
