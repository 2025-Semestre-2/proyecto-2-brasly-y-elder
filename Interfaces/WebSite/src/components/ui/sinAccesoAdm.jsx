export default function SinAcceso() {
  return (
    <main
      className="content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh"  // altura ajustada al centro visual
      }}
    >
      <div
        className="Sup-contenedor"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <div
          style={{
            border: "1px solid #f5c2c7",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "40px 50px",
            maxWidth: "650px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          {/* Ícono */}
          <div
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              backgroundColor: "#f8d7da",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 25px"
            }}
          >
            <span style={{ fontSize: "42px", color: "#dc3545" }}>⚠️</span>
          </div>

          {/* Título */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "12px"
            }}
          >
            Acceso Denegado
          </h2>

          {/* Mensaje */}
          <p
            style={{
              fontSize: "17px",
              color: "#555",
              lineHeight: "1.6"
            }}
          >
            Lo sentimos, usted es administrador y no tiene acceso a este apartado.
          </p>
        </div>
      </div>
    </main>
  );
}
