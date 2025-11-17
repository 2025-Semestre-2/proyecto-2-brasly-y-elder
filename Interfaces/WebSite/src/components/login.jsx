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

    if (email === "" || pass === "") {
      setError("Debes llenar todos los campos");
      return;
    }
    const usuario = {
      sucursal: "Limon",
      rol: "Administrador"
    };
    login(usuario);
    onLogin();
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
