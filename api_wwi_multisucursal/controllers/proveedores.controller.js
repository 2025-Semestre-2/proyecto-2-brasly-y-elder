module.exports = {
    listar: async (req, res) => {
        try {
            const request = req.db.request();
            const result = await request.execute('ModuloProveedor');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener proveedores" });
        }
    },

    detalle: async (req, res) => {
        try {
            const request = req.db.request();
            request.input('id', req.query.id);
            const result = await request.execute('DetalleProveedor');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener detalle" });
        }
    }
};
