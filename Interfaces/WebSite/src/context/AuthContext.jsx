import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [rol, setRol] = useState(null);
  const [sucursal, setSucursal] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setRol(u.rol);
      setSucursal(u.sucursal);
    }
  }, []);

  const login = (user) => {
    setRol(user.rol);
    setSucursal(user.sucursal);
    localStorage.setItem("usuario", JSON.stringify(user));
  };

  const logout = () => {
    setRol(null);
    setSucursal(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ rol, sucursal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
