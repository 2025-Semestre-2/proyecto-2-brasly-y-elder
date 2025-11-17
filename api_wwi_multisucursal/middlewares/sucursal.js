const sql = require('mssql');
const corpConfig = require('../config/db_corp');
const sjConfig = require('../config/db_sanjose');
const liConfig = require('../config/db_limon');

const pools = {
    CORP: null,
    SANJOSE: null,
    LIMON: null
};

async function getPool(sucursal) {
    if (pools[sucursal]) return pools[sucursal];

    const config =
        sucursal === 'CORP' ? corpConfig :
        sucursal === 'SANJOSE' ? sjConfig :
        sucursal === 'LIMON' ? liConfig :
        null;

    if (!config) throw new Error("Sucursal inválida.");

    pools[sucursal] = await sql.connect(config);
    return pools[sucursal];
}

module.exports = async (req, res, next) => {
    try {
        const sucursal = req.user.sucursal;
        if (!sucursal) return res.status(400).json({ error: "Sucursal no incluida en token." });

        req.db = await getPool(sucursal);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error conectando a sucursal." });
    }
};
