const corp = require("./db_corp");
const sanjose = require("./db_sanjose");
const limon = require("./db_limon");

/**
 * Selecciona la configuración de base de datos dependiendo de la sucursal
 * recibida en el token del usuario autenticado.
 *
 * @param {string} sucursal - "CORP", "SANJOSE" o "LIMON"
 * @returns {object} Configuración de conexión de mssql
 */
module.exports = function dbRouter(sucursal) {
  if (!sucursal) {
    console.warn(" db_router recibió sucursal undefined. Se usará CORP por defecto.");
    return corp;
  }

  const key = sucursal.toUpperCase();

  switch (key) {
    case "CORP":
      return corp;

    case "SANJOSE":
    case "SAN JOSÉ":
    case "SAN_JOSE":
      return sanjose;

    case "LIMON":
    case "LIMÓN":
      return limon;

    default:
      console.warn(`⚠ Sucursal '${sucursal}' no reconocida. Se usará CORP.`);
      return corp;
  }
};
