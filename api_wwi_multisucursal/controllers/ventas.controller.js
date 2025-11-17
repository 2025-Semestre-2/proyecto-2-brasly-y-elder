module.exports = {
    listar: async (req, res) => {
        try {
            const reqx = req.db.request();
            const result = await reqx.execute('ModuloVentas');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener ventas" });
        }
    }
};
