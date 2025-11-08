const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();

// ✅ Habilitar CORS para permitir peticiones desde React
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// 🔹 Configuración de la conexión a SQL Server
const config = {
    user: 'sa',
    password: 'Elp703080520*',
    server: 'localhost',
    database: 'WideWorldImporters',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        quotedIdentifiers: true
    }
};
// Crear el pool de conexión
let pool;
async function connectToDB() {
    try {
        pool = await sql.connect(config);
        console.log('Conectado a SQL Server');
    } catch (err) {
        console.error('Error de conexión:', err);
        process.exit(1);
    }
}

// Endpoint: obtener clientes con filtros
app.get('/clientes', async (req, res) => {
    const { nombre = '', categoria = '', entrega = '' } = req.query;
    try {
        const request = pool.request();
        request.input('nombre', sql.NVarChar(100), nombre);
        request.input('categoria', sql.NVarChar(100), categoria);
        request.input('entrega', sql.NVarChar(100), entrega);
        const result = await request.execute('dbo.filtrarclientes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener los datos.');
    }
});

// Endpoint: obtener informacion del clientes 
app.get('/info/clientes', async (req, res) => {
  const { id } = req.query;
  try {
    const request = pool.request();
    request.input('CustomerID', sql.Int, parseInt(id)); 
    const result = await request.execute('dbo.DetalleCliente');
    res.json(result.recordset); 
  } catch (err) {
    res.status(500).send('Error al obtener los datos.');
  }
});


// Endpoint: obtener las categorias 
app.get('/clientes/categorias', async (req, res) => {
    try {
        const result = await pool.request().execute('dbo.CategoriaCliente');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar CategoriaCliente:', err);
        res.status(500).send('Error al obtener las categorías de clientes.');
    }
});





//---------------------------------------------------------------

app.get('/inventario', async (req, res) => {
    const { nombre = '', Grupo = '' } = req.query;
    try {
        const request = pool.request();
        request.input('nombre', sql.NVarChar(100), nombre);
        request.input('grupo', sql.NVarChar(100), Grupo);

        const result = await request.execute('dbo.ModuloInventario');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar ModuloInventario:', err);
        res.status(500).send('Error al obtener el inventario.');
    }
});

// Endpoint: obtener grupos de inventario
app.get('/inventario/grupos', async (req, res) => {
    try {
        const result = await pool.request().execute('dbo.GrupoInventario');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar GrupoInventario:', err);
        res.status(500).send('Error al obtener los grupos de inventario.');
    }
});


// Endpoint: obtener informacion del Proveedor 
app.get('/inventario/info', async (req, res) => {
  const { id } = req.query;
  try {
    const request = pool.request();
    request.input('id', sql.Int, parseInt(id)); 
    const result = await request.execute('dbo.detalleproducto');
    res.json(result.recordset); 
  } catch (err) {
    res.status(500).send('Error al obtener los datos.');
  }
});
app.post('/inventario/insertar', async (req, res) => {
  try {
    const {
      StockItemName,
      SupplierID,
      UnitPackageID,
      OuterPackageID,
      LeadTimeDays,
      QuantityPerOuter,
      IsChillerStock,
      TaxRate,
      UnitPrice,
      TypicalWeightPerUnit,
      RecommendedRetailPrice = null,
      ColorID = null,
      Brand = null,
      Size = null,
      Barcode = null,
      MarketingComments = null,
      InternalComments = null
    } = req.body;

    // Validaciones básicas (opcional, pero recomendado)
    if (!StockItemName || !SupplierID || !UnitPackageID || !OuterPackageID) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const request = pool.request();
    request.input('StockItemName', sql.NVarChar(100), StockItemName);
    request.input('SupplierID', sql.Int, SupplierID);
    request.input('UnitPackageID', sql.Int, UnitPackageID);
    request.input('OuterPackageID', sql.Int, OuterPackageID);
    request.input('LeadTimeDays', sql.Int, LeadTimeDays);
    request.input('QuantityPerOuter', sql.Int, QuantityPerOuter);
    request.input('IsChillerStock', sql.Bit, IsChillerStock);
    request.input('TaxRate', sql.Decimal(18,3), TaxRate);
    request.input('UnitPrice', sql.Decimal(18,2), UnitPrice);
    request.input('TypicalWeightPerUnit', sql.Decimal(18,3), TypicalWeightPerUnit);
    request.input('RecommendedRetailPrice', sql.Decimal(18,2), RecommendedRetailPrice);
    request.input('ColorID', sql.Int, ColorID);
    request.input('Brand', sql.NVarChar(50), Brand);
    request.input('Size', sql.NVarChar(20), Size);
    request.input('Barcode', sql.NVarChar(50), Barcode);
    request.input('MarketingComments', sql.NVarChar(sql.MAX), MarketingComments);
    request.input('InternalComments', sql.NVarChar(sql.MAX), InternalComments);
    request.output('NewStockItemID', sql.Int);

    const result = await request.execute('dbo.InsertarInventario');

    const id = result.output?.NewStockItemID
            ?? result.recordset?.[0]?.StockItemID
            ?? null;

    return res.status(201).json({ StockItemID: id });
  } catch (err) {
    // Log detallado en servidor
    console.error('Error al insertar inventario:', {
      message: err.message,
      code: err.code,
      number: err.number,
      proc: err.procName || err.procedure,
      sqlInfo: err.originalError?.info,
      stack: err.stack
    });

    // Responder SIEMPRE JSON
    const sqlMsg =
      err?.originalError?.info?.message ||
      err?.message ||
      'Error al crear el producto.';
    return res.status(500).json({ error: sqlMsg });
  }
});

// Endpoint: obtener informacion del Proveedor 
// GET: obtener producto por ID (mejor respuesta JSON de error)
app.get('/inventario/Producto', async (req, res) => {
  try {
    const id = Number.parseInt(req.query.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const request = pool.request();
    request.input('StockItemID', sql.Int, id);

    const result = await request.execute('dbo.obtener_producto');
    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json(row);
  } catch (err) {
    console.error('GET /inventario/Producto error:', err);
    return res.status(500).json({
      error:
        err?.originalError?.info?.message ||
        err?.message ||
        'Error al obtener los datos.'
    });
  }
});


// Modificar inventario (manteniendo /inventario/modificar/:id)
app.put('/inventario/modificar/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const b = req.body;

    const request = pool.request();
    request.input('StockItemID', sql.Int, id);
    request.input('StockItemName', sql.NVarChar(100), b.StockItemName);
    request.input('SupplierID', sql.Int, Number(b.SupplierID));
    request.input('UnitPackageID', sql.Int, Number(b.UnitPackageID));
    request.input('OuterPackageID', sql.Int, Number(b.OuterPackageID));
    request.input('LeadTimeDays', sql.Int, Number(b.LeadTimeDays));
    request.input('QuantityPerOuter', sql.Int, Number(b.QuantityPerOuter));
    request.input('IsChillerStock', sql.Bit, b.IsChillerStock ? 1 : 0);
    request.input('TaxRate', sql.Decimal(18,3), Number(b.TaxRate));
    request.input('UnitPrice', sql.Decimal(18,2), Number(b.UnitPrice));
    request.input('TypicalWeightPerUnit', sql.Decimal(18,3), Number(b.TypicalWeightPerUnit));
    request.input('RecommendedRetailPrice', sql.Decimal(18,2),
      b.RecommendedRetailPrice === '' || b.RecommendedRetailPrice === null ? null : Number(b.RecommendedRetailPrice));
    request.input('ColorID', sql.Int, b.ColorID === '' || b.ColorID === null ? null : Number(b.ColorID));
    request.input('Brand', sql.NVarChar(50), b.Brand || null);
    request.input('Size', sql.NVarChar(20), b.Size || null);
    request.input('Barcode', sql.NVarChar(50), b.Barcode || null);
    request.input('MarketingComments', sql.NVarChar(sql.MAX), b.MarketingComments || null);
    request.input('InternalComments', sql.NVarChar(sql.MAX), b.InternalComments || null);

    // ⚠️ Nombre del SP que sí existe
    const result = await request.execute('dbo.ActualizarInventario');

    const affected = result.recordset?.[0]?.Affected ?? 0;
    if (affected === 0) {
      // No existía el ID o no hubo cambios en valores
      return res.status(404).json({ error: 'Producto no encontrado o sin cambios' });
    }
    return res.json({ updated: affected });
  } catch (err) {
    console.error('PUT /inventario/modificar/:id error:', {
      message: err.message,
      code: err.code,
      number: err.number,
      proc: err.procName || err.procedure,
      sqlInfo: err.originalError?.info,
      stack: err.stack
    });
    const msg = err?.originalError?.info?.message || err?.message || 'Error al actualizar el producto.';
    return res.status(500).json({ error: msg });
  }
});



// eliminar inventario
app.delete('/inventario/eliminar/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const request = pool.request();
    request.input('StockItemID', sql.Int, id);
    const result = await request.execute('dbo.EliminarInventario');
    const affected = result.recordset?.[0]?.Affected ?? 0;
    if (affected === 0) return res.status(404).json({ error: 'No encontrado o no eliminado.' });
    res.json({ deleted: affected });
  } catch (err) {
    console.error('Error al eliminar inventario:', err);
    res.status(400).json({ error: err?.originalError?.info?.message || 'No se pudo eliminar.' });
  }
});

app.get('/inventario/categorias', async (req, res) => {
  try {
    const result = await pool.request().execute('dbo.categoriasClientes');
    res.json(result.recordset); 
  } catch (err) {
    console.error('Error al ejecutar categoriasClientes:', err);
    res.status(500).send('Error al obtener categorías de clientes.');
  }
});


app.get('/proveedores/lista', async (req, res) => {
  try {
    const result = await pool.request().execute('dbo.ListarProveedores');
    res.json(result.recordset); 
  } catch (err) {
    console.error('Error al ejecutar ListarProveedores:', err);
    res.status(500).send('Error al obtener proveedores.');
  }
});

app.get('/colores/lista', async (req, res) => {
  try {
    const result = await pool.request().execute('dbo.ListarColores');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al ejecutar ListarColores:', err);
    res.status(500).send('Error al obtener colores.');
  }
});

app.get('/paquetes/lista', async (req, res) => {
  if (!pool) return res.status(500).send('❌ Pool de conexión no disponible');
  try {
    const result = await pool.request().execute('dbo.ListarPaquetes');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al ejecutar ListarPaquetes:', err);
    res.status(500).send('Error al obtener tipos de paquete.');
  }
});

app.get('/grupos/lista', async (req, res) => {
  try {
    const result = await pool.request().execute('dbo.ListarGruposProductos');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al ejecutar ListarGruposProductos:', err);
    res.status(500).send('Error al obtener grupos de productos.');
  }
});

//---------------------------------------------------------------

// Endpoint: obtener proveedores con filtros
app.get('/proveedores', async (req, res) => {
    if (!pool) return res.status(500).send('❌ Pool de conexión no disponible');
    const { nombre = '', categoria = '', entrega = '' } = req.query;
    try {
        const request = pool.request();
        request.input('nombre', sql.NVarChar(100), nombre);
        request.input('categoria', sql.NVarChar(100), categoria);
        request.input('entrega', sql.NVarChar(100), entrega);

        const result = await request.execute('dbo.ModuloProveedor');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar ModuloProveedor:', err);
        res.status(500).send('Error al obtener los proveedores.');
    }
});

// Endpoint: obtener categorías de proveedores
app.get('/proveedores/categorias', async (req, res) => {
    if (!pool) return res.status(500).send('❌ Pool de conexión no disponible');
    try {
        const result = await pool.request().execute('dbo.CategoriaProveedor');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar CategoriaProveedor:', err);
        res.status(500).send('Error al obtener las categorías de proveedores.');
    }
});

// Endpoint: obtener informacion del Proveedor 
app.get('/proveedores/info', async (req, res) => {
  const { id } = req.query;
  try {
    const request = pool.request();
    request.input('id', sql.Int, parseInt(id)); 
    const result = await request.execute('dbo.DetalleProveedor');
    res.json(result.recordset); 
  } catch (err) {
    res.status(500).send('Error al obtener los datos.');
  }
});




//---------------------------------------------------------------


// Endpoint: obtener ventas con filtros
app.get('/ventas', async (req, res) => {

    const {
        nombre_cliente = '',
        fecha_inicio = null,
        fecha_fin = null,
        monto_min = null,
        monto_max = null
    } = req.query;

    try {
        const request = pool.request();
        request.input('nombre_cliente', sql.NVarChar(100), nombre_cliente);
        request.input('fecha_inicio', sql.Date, fecha_inicio || null);
        request.input('fecha_fin', sql.Date, fecha_fin || null);
        request.input('monto_min', sql.Money, monto_min ? parseFloat(monto_min) : null);
        request.input('monto_max', sql.Money, monto_max ? parseFloat(monto_max) : null);

        const result = await request.execute('dbo.ModuloVentas');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error al obtener las ventas.');
    }
});

// Endpoint: obtener encabezadod de la venta  
app.get('/venta/encabezado', async (req, res) => {

  const { id } = req.query;
  try {
    const request = pool.request();
    request.input('id', sql.Int, parseInt(id)); 
    const result = await request.execute('dbo.EncabezadoFactura');
    res.json(result.recordset); 
  } catch (err) {
    res.status(500).send('Error al obtener los datos.');
  }
});

// Endpoint: obtener encabezadod de la venta  
app.get('/venta/detalle', async (req, res) => {
  const { id } = req.query;
  try {
    const request = pool.request();
    request.input('id', sql.Int, parseInt(id)); 
    const result = await request.execute('dbo.DetalleFactura');
    res.json(result.recordset); 
  } catch (err) {
    res.status(500).send('Error al obtener los datos.');
  }
});


// ---------------------------------------------------------------
// Estadisticas

app.get('/Estadisticas/Proveedores', async (req, res) => {
    const { nombre_proveedor = '', categoria = '' } = req.query;
    try {
        const request = pool.request();
        request.input('nombre_proveedor', sql.NVarChar(100), nombre_proveedor);
        request.input('categoria', sql.NVarChar(100), categoria);

        const result = await request.execute('dbo.estadisticas_proveedores');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar estadisticas_proveedores:', err);
        res.status(500).send('Error al obtener las estadísticas de proveedores.');
    }
});

app.get('/Estadisticas/ventas', async (req, res) => {
    const { nombre_cliente = '', categoria = '' } = req.query;
    try {
        const request = pool.request();
        request.input('nombre_cliente', sql.NVarChar(100), nombre_cliente);
        request.input('categoria', sql.NVarChar(100), categoria);

        const result = await request.execute('dbo.estadisticas_ventas');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar estadisticas_ventas:', err);
        res.status(500).send('Error al obtener las estadísticas de ventas.');
    }
});

app.get('/Estadisticas/top_productos', async (req, res) => {
    const { año = '' } = req.query;
    try {
        const request = pool.request();
        request.input('año', sql.Int, parseInt(año));
        const result = await request.execute('dbo.top5_productos');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar top5_productos:', err);
        res.status(500).send('Error al obtener las estadísticas de top productos.');
    }
});

app.get('/Estadisticas/top_clientes', async (req, res) => {
    const { año_inicio = '', año_fin = '' } = req.query;
    try {
        const request = pool.request();
        request.input('año_inicio', sql.Int, parseInt(año_inicio));
        request.input('año_fin', sql.Int, parseInt(año_fin));
        const result = await request.execute('dbo.top5_clientes');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar top5_clientes:', err);
        res.status(500).send('Error al obtener las estadísticas de top clientes.');
    }
});
app.get('/Estadisticas/top_proveedores', async (req, res) => {
    const { año_inicio = '', año_fin = '' } = req.query;
    try {
        const request = pool.request();
        request.input('año_inicio', sql.Int, parseInt(año_inicio));
        request.input('año_fin', sql.Int, parseInt(año_fin));
        const result = await request.execute('dbo.top5_proveedores_ordenes');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al ejecutar top5_proveedores_ordenes:', err);
        res.status(500).send('Error al obtener las estadísticas de top proveedores.');
    }
});






const PORT = 3000;
connectToDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
});
