import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí podrías validar o llamar a tu API
    console.log("Email:", email, "Password:", pass);

    // 👉 Cuando se loguea correctamente se llama onLogin()
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Ingresa tus credenciales para acceder</p>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
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
