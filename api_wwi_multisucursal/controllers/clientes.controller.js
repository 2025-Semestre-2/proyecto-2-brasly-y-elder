const sql = require("mssql");
const dbRouter = require("../config/db_router");

exports.listarClientes = async (req, res) => {
  try {
    const pool = await sql.connect(dbRouter(req.user.sucursal)); 
    const result = await pool.request().execute("dbo.filtrarclientes");
    return res.json(result.recordset);
  } catch (err) {
    console.error("Error listarClientes:", err);
    return res.status(500).json({ error: "No se pudieron obtener clientes" });
  }
};

exports.detalleCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbRouter(req.user.sucursal));
    const request = pool.request();
    request.input("CustomerID", sql.Int, parseInt(id));
    const result = await request.execute("dbo.DetalleCliente");

    if (result.recordset.length === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    return res.json(result.recordset[0]);

  } catch (err) {
    console.error("Error detalleCliente:", err);
    return res.status(500).json({ error: "No se pudo obtener el cliente" });
  }
};
