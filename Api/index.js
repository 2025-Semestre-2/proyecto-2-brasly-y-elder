process.on("uncaughtException", (err) => {
  console.error("❌ EXCEPCIÓN NO CAPTURADA:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ PROMESA NO MANEJADA:", reason);
});

const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());


// ======================================================================
//  1. CONFIGURACIÓN DE CONEXIONES (3 SERVIDORES)
// ======================================================================

const conexiones = {
  SanJose: {
    user: "sa",
    password: "Admin1234*",
    server: "localhost",
    port: 1534,
    database: "WideWorldImporters",
    options: { encrypt: false, trustServerCertificate: true }
  },

  Limon: {
    user: "sa",
    password: "Admin1234*",
    server: "localhost",
    port: 1535,
    database: "WideWorldImporters",
    options: { encrypt: false, trustServerCertificate: true }
  },

  Corp: {
    user: "sa",
    password: "Admin1234*",
    server: "localhost",
    port: 1536,
    database: "WideWorldImporters",
    options: { encrypt: false, trustServerCertificate: true }
  }
};

// Crear los pools
const pools = {};

async function inicializarPools() {
  console.log("🟡 Iniciando conexión a 3 servidores...");
  pools.CORP = await new sql.ConnectionPool(conexiones.Corp).connect();
  pools.SANJOSE = await new sql.ConnectionPool(conexiones.SanJose).connect();
  pools.LIMON = await new sql.ConnectionPool(conexiones.Limon).connect();
  console.log("🟢 Conectado a CORP, SAN JOSÉ y LIMÓN");
}


// ======================================================================
//  2. AYUDA: SELECCIONAR SUCURSAL
// ======================================================================

function poolSucursal(s) {
  if (!s) return null;
  s = s.toUpperCase();
  if (s === "SANJOSE") return pools.SANJOSE;
  if (s === "LIMON") return pools.LIMON;
  if (s === "CORP") return pools.CORP;
  return null;
}


// ======================================================================
//  3. INVENTARIO DISTRIBUIDO (CORPORATIVO)
// ======================================================================

// Listado distribuido
app.get("/inventario/distribuido", async (req, res) => {
  try {
    const { nombre = "", sucursal = "TODAS" } = req.query;

    const r = pools.CORP.request();
    r.input("nombre", sql.NVarChar(100), nombre);
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_moduloinventario_distribuido");
    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en inventario distribuido." });
  }
});

// Detalle distribuido por sucursal
app.get("/inventario/detalle", async (req, res) => {
  try {
    const { id, sucursal } = req.query;

    const r = pools.CORP.request();
    r.input("id", sql.Int, parseInt(id));
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_detalleproducto_distribuido");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: "Error en detalle distribuido" });
  }
});


// ======================================================================
//  4. CRUD DE INVENTARIO (POR SUCURSAL)
// ======================================================================

// Insert
app.post("/inventario/insertar", async (req, res) => {
  try {
    const { sucursal, ...body } = req.body;
    const pool = poolSucursal(sucursal);

    if (!pool) return res.status(400).json({ error: "Sucursal inválida" });

    const r = pool.request();
    for (const k in body) {
      r.input(k, body[k]);
    }

    const result = await r.execute("dbo.insertarinventario");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update
app.put("/inventario/modificar/:id", async (req, res) => {
  try {
    const sucursal = req.body.sucursal;
    const pool = poolSucursal(sucursal);
    if (!pool) return res.status(400).json({ error: "Sucursal inválida" });

    const r = pool.request();
    r.input("stockitemid", sql.Int, parseInt(req.params.id));

    for (const k in req.body) {
      if (k === "sucursal") continue;
      r.input(k, req.body[k]);
    }

    const result = await r.execute("dbo.actualizarinventario");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete
app.delete("/inventario/eliminar/:id", async (req, res) => {
  try {
    const sucursal = req.query.sucursal;
    const pool = poolSucursal(sucursal);

    if (!pool) return res.status(400).json({ error: "Sucursal inválida" });

    const r = pool.request();
    r.input("stockitemid", sql.Int, parseInt(req.params.id));

    const result = await r.execute("dbo.eliminarinventario");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ======================================================================
//  5. CATÁLOGOS (CORPORATIVO)
// ======================================================================

app.get("/colores", async (_, res) => {
  const r = pools.CORP.request();
  const result = await r.execute("dbo.ListarColores");
  res.json(result.recordset);
});

app.get("/proveedores", async (_, res) => {
  const r = pools.CORP.request();
  const result = await r.execute("dbo.ListarProveedores");
  res.json(result.recordset);
});

app.get("/paquetes", async (_, res) => {
  const r = pools.CORP.request();
  const result = await r.execute("dbo.ListarPaquetes");
  res.json(result.recordset);
});

app.get("/grupos", async (_, res) => {
  const r = pools.CORP.request();
  const result = await r.execute("dbo.ListarGruposProductos");
  res.json(result.recordset);
});


// ======================================================================
//  6. CLIENTES DISTRIBUIDOS
// ======================================================================

// Listar clientes de todas las sucursales
app.get("/clientes/distribuido", async (req, res) => {
  try {
    const { nombre = "", categoria = "", entrega = "", sucursal = "TODAS" } = req.query;

    const r = pools.CORP.request();
    r.input("nombre", sql.NVarChar(100), nombre);
    r.input("categoria", sql.NVarChar(100), categoria);
    r.input("entrega", sql.NVarChar(100), entrega);
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_filtrarclientes_distribuido");
    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en clientes distribuidos" });
  }
});

// Detalle por sucursal
app.get("/clientes/detalle", async (req, res) => {
  try {
    const { id, sucursal } = req.query;

    const r = pools.CORP.request();
    r.input("customerid", sql.Int, parseInt(id));
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_detallecliente_distribuido");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: "Error en detalle cliente distribuido" });
  }
});


// ======================================================================
//  7. ESTADÍSTICAS DISTRIBUIDAS
// ======================================================================

app.get("/estadisticas/top_productos", async (req, res) => {
  try {
    const { anio = null, sucursal = "TODAS" } = req.query;

    const r = pools.CORP.request();
    r.input("anio", sql.Int, anio ? parseInt(anio) : null);
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_top5_productos");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: "Error en top productos." });
  }
});


app.get("/estadisticas/top_clientes", async (req, res) => {
  try {
    const { anio = null, sucursal = "TODAS" } = req.query;

    const r = pools.CORP.request();
    r.input("anio", sql.Int, anio ? parseInt(anio) : null);
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_top5_clientes");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: "Error en top clientes." });
  }
});


app.get("/estadisticas/ventas_sucursal", async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, sucursal = "TODAS" } = req.query;

    const r = pools.CORP.request();
    r.input("fecha_inicio", sql.Date, fecha_inicio || null);
    r.input("fecha_fin", sql.Date, fecha_fin || null);
    r.input("sucursal", sql.NVarChar(20), sucursal);

    const result = await r.execute("dbo.sp_ventas_por_sucursal");
    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: "Error en ventas por sucursal." });
  }
});
///==========================


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const r = pools.CORP.request();
    r.input("email", sql.VarChar(100), email);
    r.input("password", sql.VarChar(200), password);

    const result = await r.execute("dbo.validarusuario");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.recordset[0];

    res.json({
      iduser: user.iduser,
      username: user.username,
      fullname: user.fullname,
      rol: user.rol,
      email: user.email,
      sucursal: user.sucursal,
      active: user.active,
      hiredate: user.hiredate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el login" });
  }
});

// ======================================================================
//  SERVIDOR
// ======================================================================

const PORT = 3000;

inicializarPools().then(() => {
  app.listen(PORT, () => console.log(`🚀 API funcionando: http://localhost:${PORT}`));
});
