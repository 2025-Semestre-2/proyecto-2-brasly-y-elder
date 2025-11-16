USE WideWorldImporters;
go

-- Modulo Cliente
-- Filtrar Clientes
exec dbo.filtrarclientes;
go
-- Modulo Cliente
exec dbo.CategoriaCliente;
go
-- Detalle Cliente
exec dbo.DetalleCliente @CustomerID = 1;
go
-- Categorias Clientes
exec dbo.categoriasClientes;
go

-- Modulo Inventario
exec dbo.ModuloInventario;
go
-- Grupo Inventario
exec dbo.GrupoInventario;
go
-- Detalle Producto
exec dbo.detalleproducto @id = 1;
go

-- Modulo Proveedor
exec dbo.ModuloProveedor;
go
-- Categorias Proveedores
exec dbo.CategoriaProveedor;
go
-- Detalle Proveedor
exec dbo.DetalleProveedor @id = 1;
go

-- Modulo Ventas
exec dbo.ModuloVentas;
go
-- Encabezado Factura
exec dbo.EncabezadoFactura @id = 1;
go
-- Detalle Factura
exec dbo.DetalleFactura @id = 1;
go


-- Estadisticas Proveedores
exec dbo.estadisticas_proveedores;
go

-- Estadisticas Ventas

exec dbo.estadisticas_ventas @nombre_cliente = N'', @categoria = N'';
go

-- Estadisticas Inventario
exec dbo.top5_productos @año = 2015;
go

-- Estadisticas Compras
exec dbo.top5_clientes;
go

-- Estadisticas Proveedores Ordenes

exec dbo.top5_proveedores_ordenes;
go

-- Inventario CRUD
DECLARE @NuevoID INT;
exec dbo.InsertarInventario 
  @StockItemName = N'Nuevo Producto',
  @SupplierID = 1,
  @UnitPackageID = 7,
  @OuterPackageID = 7,
  @LeadTimeDays = 3,
  @QuantityPerOuter = 10,
  @IsChillerStock = 0,
  @TaxRate = 15.0,
  @UnitPrice = 50.00,
  @TypicalWeightPerUnit = 0.5,
  @RecommendedRetailPrice = 75.00,
  @ColorID = 2,
  @Brand = N'MarcaTest',
  @Size = N'Mediano',
  @Barcode = N'1234567890',
  @MarketingComments = N'Producto de prueba',
  @InternalComments = N'Comentario interno',
  @NewStockItemID = @NuevoID OUTPUT;
SELECT @NuevoID AS NuevoProducto;
go

exec dbo.ActualizarInventario
  @StockItemID = 1,
  @StockItemName = N'Producto Actualizado',
  @SupplierID = 1,
  @UnitPackageID = 7,
  @OuterPackageID = 7,
  @LeadTimeDays = 5,
  @QuantityPerOuter = 15,
  @IsChillerStock = 0,
  @TaxRate = 12.5,
  @UnitPrice = 60.00,
  @TypicalWeightPerUnit = 0.45,
  @RecommendedRetailPrice = 80.00,
  @ColorID = 2,
  @Brand = N'MarcaX',
  @Size = N'Grande',
  @Barcode = N'0987654321',
  @MarketingComments = N'Actualizado',
  @InternalComments = N'Edición test';
go

-- Eliminar Inventario
exec dbo.eliminarInventario @StockItemID = 999;
go

-- Listados
exec dbo.ListarProveedores;
go

-- Colores
exec dbo.ListarColores;
go
-- Marcas
exec dbo.ListarPaquetes;
go
-- Grupos Productos
exec dbo.ListarGruposProductos;
go
-- Productos
exec dbo.obtener_producto @StockItemID = 1;
go
