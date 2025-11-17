const sql = require("mssql");

const base = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const configs = {
  CORP: { ...base, server: process.env.DB_HOST_CORP, port: parseInt(process.env.DB_PORT_CORP) },
  SANJOSE: { ...base, server: process.env.DB_HOST_SANJOSE, port: parseInt(process.env.DB_PORT_SANJOSE) },
  LIMON: { ...base, server: process.env.DB_HOST_LIMON, port: parseInt(process.env.DB_PORT_LIMON) }
};

const pools = {};

async function getPoolBySucursal(sucursal) {
  sucursal = sucursal.toUpperCase();
  if (!configs[sucursal]) throw new Error(`Sucursal inválida: ${sucursal}`);

  if (!pools[sucursal]) {
    pools[sucursal] = new sql.ConnectionPool(configs[sucursal]).connect();
  }

  return pools[sucursal];
}

module.exports = { sql, getPoolBySucursal };
