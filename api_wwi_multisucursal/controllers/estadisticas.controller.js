module.exports = {
    topProductos: async (req, res) => {
        try {
            const r = req.db.request();
            r.input("anio", req.query.anio);
            const result = await r.execute("sp_top5_productos");
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error top productos" });
        }
    },

    topClientes: async (req, res) => {
        try {
            const r = req.db.request();
            r.input("anio_inicio", req.query.inicio);
            r.input("anio_fin", req.query.fin);
            const result = await r.execute("sp_top5_clientes");
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error top clientes" });
        }
    },

    ventasPorMes: async (req, res) => {
        try {
            const r = req.db.request();
            r.input("anio_inicio", req.query.inicio);
            r.input("anio_fin", req.query.fin);
            const result = await r.execute("sp_ventas_por_mes");
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error ventas mes" });
        }
    },

    ventasPorCategoria: async (req, res) => {
        try {
            const r = req.db.request();
            r.input("anio", req.query.anio);
            const result = await r.execute("sp_ventas_por_categoria");
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error ventas categoría" });
        }
    }
};
