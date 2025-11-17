const jwt = require("jsonwebtoken");
const { getPoolBySucursal, sql } = require("../config/db");

function mapSucursal(texto) {
  const t = texto.toUpperCase();
  if (t === "CORPORATIVO") return "CORP";
  if (t.includes("SAN")) return "SANJOSE";
  if (t.includes("LIM")) return "LIMON";
  return null;
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await getPoolBySucursal("CORP");
    const result = await pool
      .request()
      .input("email", sql.VarChar(100), email)
      .input("password", sql.VarChar(200), password)
      .execute("validarusuario");

    const u = result.recordset[0];
    if (!u) return res.status(401).json({ message: "Credenciales incorrectas" });

    const sucursalShort = mapSucursal(u.sucursal);
    const token = jwt.sign(
      {
        iduser: u.iduser,
        username: u.username,
        rol: u.rol,
        sucursal: sucursalShort
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, usuario: u });
  } catch (err) {
    res.status(500).json({ message: "Error en login", error: err.message });
  }
};
