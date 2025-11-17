require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Rutas
const authRoutes = require("./routes/auth.routes");
const inventarioRoutes = require("./routes/inventario.routes");
const clientesRoutes = require("./routes/clientes.routes");
const proveedoresRoutes = require("./routes/proveedores.routes");
const ventasRoutes = require("./routes/ventas.routes");
const estadisticasRoutes = require("./routes/estadisticas.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Endpoints base
app.use("/auth", authRoutes);
app.use("/inventario", inventarioRoutes);
app.use("/clientes", clientesRoutes);
app.use("/proveedores", proveedoresRoutes);
app.use("/ventas", ventasRoutes);
app.use("/estadisticas", estadisticasRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Corporativa & Sucursales funcionando" });
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Servidor activo en http://localhost:${port}`)
);
