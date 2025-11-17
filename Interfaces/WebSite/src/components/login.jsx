import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.message || "Credenciales inválidas");
        return;
      }

      // Guardar token y usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("sucursal", data.usuario.sucursal);

      console.log("Usuario:", data.usuario);

      // Continuar a la app
      onLogin();

    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Ingresa tus credenciales para acceder</p>

        <form onSubmit={handleSubmit} className="login-form">

          {error && <p className="login-error">{error}</p>}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>

      </div>
    </div>
  );
}
