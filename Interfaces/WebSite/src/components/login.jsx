import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || pass.trim() === "") {
      setError("Debes llenar todos los campos");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass })
      });

      if (!resp.ok) {
        setError("Credenciales incorrectas");
        return;
      }

      const user = await resp.json();

      const usuarioFinal = {
        rol: user.rol,
        sucursal: user.sucursal
      };

      login(usuarioFinal); 
      onLogin();             

    } catch (err) {
      setError("No se pudo conectar con el servidor");
      console.error("Error login:", err);
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
