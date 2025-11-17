module.exports = {
    listado: async (req, res) => {
        try {
            const { nombre = '', grupo = '' } = req.query;
            const r = req.db.request();
            r.input('nombre', nombre);
            r.input('grupo', grupo);
            const result = await r.execute('sp_moduloinventario_distribuido');
            res.json(result.recordset);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error al obtener inventario" });
        }
    },

    detalle: async (req, res) => {
        try {
            const r = req.db.request();
            r.input('id', req.query.id);
            const result = await r.execute('sp_detalleproducto_distribuido');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener detalle" });
        }
    },

    insertar: async (req, res) => {
        try {
            const b = req.body;
            const r = req.db.request();

            for (let k in b) {
                r.input(k, b[k]);
            }

            const result = await r.execute("insertarinventario");
            res.json({ newId: result.recordset[0].stockitemid });
        } catch (err) {
            res.status(500).json({ error: "Error insertando inventario", detalle: err.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const b = req.body;
            const r = req.db.request();
            r.input("stockitemid", req.params.id);

            for (let k in b) {
                r.input(k, b[k] === '' ? null : b[k]);
            }

            const result = await r.execute("actualizarinventario");
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: "Error actualizando inventario" });
        }
    },

    eliminar: async (req, res) => {
        try {
            const r = req.db.request();
            r.input("stockitemid", req.params.id);

            const result = await r.execute("eliminarinventario");
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: "Error eliminando inventario" });
        }
    }
};
