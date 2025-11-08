
use WideWorldImporters;
go


-- ===== sinónimos de tablas principales =====


create synonym dbo.facturas for sales.invoices;
create synonym dbo.lineas_factura  for sales.invoicelines;
create synonym dbo.clientes for sales.customers;
create synonym dbo.categorias_cliente for sales.customercategories;
create synonym dbo.grupos_compra for sales.BuyingGroups;
create synonym dbo.ordenes_compra for purchasing.purchaseorders;
create synonym dbo.lineas_orden_compra for purchasing.purchaseorderlines;
create synonym dbo.proveedores for purchasing.suppliers;
create synonym dbo.categorias_proveedor for purchasing.suppliercategories;
create synonym dbo.articulos for warehouse.stockitems;
create synonym dbo.grupos_articulo for warehouse.stockgroups;
create synonym dbo.existencias for warehouse.stockitemholdings;
create synonym dbo.transacciones_inventario for warehouse.stockitemtransactions;
create synonym dbo.colores for warehouse.colors;
create synonym dbo.tipos_empaque for warehouse.packagetypes;
create synonym dbo.personas for application.people;
create synonym dbo.metodos_entrega for application.deliverymethods;
create synonym dbo.metodos_pago for application.paymentmethods;
create synonym dbo.tipos_transaccion for application.transactiontypes;
create synonym dbo.ciudades for application.cities;
create synonym dbo.estados_provincia for application.stateprovinces;
create synonym dbo.paises for application.countries;
go

-- Modulo Cliente 

-- Procedure para filtrar clientes
create procedure dbo.filtrarclientes
    @nombre nvarchar(100) = '',
    @categoria nvarchar(100) = '',
    @entrega nvarchar(100) = ''
as
begin
    set nocount on;

    select
        c.CustomerID as id,
        c.CustomerName as nombre_cliente,
        cc.CustomerCategoryName as categoria,
        dm.DeliveryMethodName as metodo_entrega
    from dbo.clientes as c
    left join dbo.categorias_cliente as cc on c.CustomerCategoryID = cc.CustomerCategoryID
    left join dbo.metodos_entrega as dm on c.DeliveryMethodID = dm.DeliveryMethodID
    where
        (c.CustomerName like '%' + @nombre + '%' or @nombre = '')
        and (cc.CustomerCategoryName like '%' + @categoria + '%' or @categoria = '')
        and (dm.DeliveryMethodName like '%' + @entrega + '%' or @entrega = '')
    order by c.CustomerName asc;
end;
go
-- Procedure para listar categorias de clientes
create procedure dbo.CategoriaCliente
as
begin
    select CustomerCategoryName as Categorias
    from dbo.categorias_cliente;
end;
go

-- Procedure para detalle de cliente
create procedure dbo.DetalleCliente
    @CustomerID int
as
begin
    set nocount on;

    select 
        c.CustomerID as ID,
        c.CustomerName as Cliente,
        cc.CustomerCategoryName as Categoria,
        bg.BuyingGroupName as GrupoCompra,
        p.FullName as ContactoPrimario,
        pa.FullName as ContactoAlternativo,
        c.BillToCustomerID as ClienteFacturarID,
        dm.DeliveryMethodName as MetodoEntrega,
        dc.CityName as CiudadEntrega,
        c.DeliveryPostalCode as CodigoPostal,
        c.PhoneNumber as Telefono,
        c.FaxNumber as Fax,
        c.PaymentDays as DiasGraciaPago,
        c.WebsiteURL as SitioWeb,
        c.DeliveryAddressLine1 as DireccionEntrega,
        c.DeliveryAddressLine2 as DireccionEntrega2,
        c.PostalAddressLine1 as DireccionPostal,
        c.PostalAddressLine2 as DireccionPostal2,
        c.DeliveryLocation.Lat as Latitud,
        c.DeliveryLocation.Long as Longitud
    from dbo.clientes as c
    left join dbo.categorias_cliente as cc on c.CustomerCategoryID = cc.CustomerCategoryID
    left join dbo.grupos_compra as bg on c.BuyingGroupID = bg.BuyingGroupID
    left join dbo.personas as p on c.PrimaryContactPersonID = p.PersonID
    left join dbo.personas as pa on c.AlternateContactPersonID = pa.PersonID
    left join dbo.metodos_entrega as dm on c.DeliveryMethodID = dm.DeliveryMethodID
    left join dbo.ciudades as dc on c.DeliveryCityID = dc.CityID
    where c.CustomerID = @CustomerID;
end;
go

-- Modulo Inventario 



-- Procedure para filtrar inventario
create procedure dbo.ModuloInventario
    @nombre nvarchar(100) = '',
    @grupo nvarchar(100) = ''
as
begin
    set nocount on;

    select
        si.StockItemID as ID,
        si.StockItemName as NombreProducto,
        string_agg(sg.StockGroupName, ', ') as Grupos,
        isnull(sih.QuantityOnHand, 0) as Cantidad
    from dbo.articulos as si
    left join dbo.existencias as sih
        on si.StockItemID = sih.StockItemID
    left join warehouse.StockItemStockGroups as sisg
        on si.StockItemID = sisg.StockItemID
    left join dbo.grupos_articulo as sg
        on sisg.StockGroupID = sg.StockGroupID
       and (@grupo = '' or sg.StockGroupName like '%' + @grupo + '%')
    where (@nombre = '' or si.StockItemName like '%' + @nombre + '%')
    group by si.StockItemID, si.StockItemName, isnull(sih.QuantityOnHand, 0)
    order by si.StockItemName asc;
end;
go

-- Procedure para listar grupos de inventario
create procedure dbo.GrupoInventario
as
begin
    select StockGroupName as Grupos
    from dbo.grupos_articulo;
end;
go

create procedure dbo.detalleproducto
    @id int
as
begin
    set nocount on;

    select
        si.StockItemID as idproducto,
        si.StockItemName as nombreproducto,
        s.SupplierName as nombreproveedor,
        c.ColorName as color,
        pt.PackageTypeName as unidadempaquetamiento,
        pt.PackageTypeName as empaquetamiento,
        si.QuantityPerOuter as cantidadporempaquetamiento,
        si.Brand as marca,
        si.Size as talla,
        si.TaxRate as impuesto,
        si.UnitPrice as preciounitario,
        si.RecommendedRetailPrice as precioventa,
        si.TypicalWeightPerUnit as peso,
        si.SearchDetails as palabrasclave,
        sih.QuantityOnHand as cantidaddisponible,
        sih.BinLocation as ubicacion
    from dbo.articulos as si
    left join dbo.proveedores as s on si.SupplierID = s.SupplierID
    left join dbo.colores as c on si.ColorID = c.ColorID
    left join dbo.tipos_empaque as pt on si.UnitPackageID = pt.PackageTypeID
    left join dbo.existencias as sih on si.StockItemID = sih.StockItemID
    where si.StockItemID = @id;
end;
go

-- Modulo Proveedor 

-- Procedure para filtrar proveedores
create procedure dbo.ModuloProveedor
    @nombre nvarchar(100) = '',
    @categoria nvarchar(100) = '',
    @entrega nvarchar(100) = ''
as
begin
    set nocount on;

    select
        s.SupplierID as id_proveedor,
        s.SupplierName as nombre_proveedor,
        sc.SupplierCategoryName as categoria,
        dm.DeliveryMethodName as metodo_entrega
    from dbo.proveedores as s
    left join dbo.categorias_proveedor as sc on s.SupplierCategoryID = sc.SupplierCategoryID
    left join dbo.metodos_entrega as dm on s.DeliveryMethodID = dm.DeliveryMethodID
    where
        (s.SupplierName like '%' + @nombre + '%' or @nombre = '')
        and (sc.SupplierCategoryName like '%' + @categoria + '%' or @categoria = '')
        and (dm.DeliveryMethodName like '%' + @entrega + '%' or @entrega = '')
    order by s.SupplierName asc;
end;
go

-- Procedure para listar categorias de proveedores
create procedure dbo.CategoriaProveedor
as
begin
    select SupplierCategoryName as CatProveedores
    from dbo.categorias_proveedor;
end;
go


-- Procedure para detalle de proveedor
create procedure dbo.DetalleProveedor
    @id int
as
begin
    set nocount on;

    select
        s.SupplierID as id,
        s.SupplierReference as referencia,
        s.SupplierName as NombreProveedor,
        sc.SupplierCategoryName as Categoria,
        pc.PersonID as PrimarioContactoID,
        pc.FullName as PrimarioContactoNombre,
        pc.PhoneNumber as PrimarioContactoNumero,
        pc.EmailAddress as PrimarioContactoEmail,
        ac.PersonID as AlternativoContactoID,
        ac.FullName as AlternativoContactoNombre,
        ac.PhoneNumber as AlternativoContactoNumero,
        ac.EmailAddress as AlternativoContactoEmail,
        dm.DeliveryMethodName as MetodoEntrega,
        dc.CityName as CiudadEntrega,
        s.DeliveryPostalCode as CodigoPostal,
        s.PhoneNumber as Telefono,
        s.FaxNumber as Fax,
        s.WebsiteURL as SitioWeb,
        s.DeliveryAddressLine1,
        s.DeliveryAddressLine2,
        s.PostalAddressLine1,
        s.PostalAddressLine2,
        s.PostalPostalCode,
        s.DeliveryLocation.Lat as Latitud,
        s.DeliveryLocation.Long as Longitud,
        s.BankAccountName as NombreBanco,
        s.BankAccountBranch as SucursalBanco,
        s.BankAccountCode as CodigoBanco,
        s.BankAccountNumber as NumeroCuenta,
        s.BankInternationalCode as CodigoInternacional,
        s.PaymentDays as DiasPago
    from dbo.proveedores as s
    left join dbo.categorias_proveedor as sc on s.SupplierCategoryID = sc.SupplierCategoryID
    left join dbo.personas as pc on s.PrimaryContactPersonID = pc.PersonID
    left join dbo.personas as ac on s.AlternateContactPersonID = ac.PersonID
    left join dbo.metodos_entrega as dm on s.DeliveryMethodID = dm.DeliveryMethodID
    left join dbo.ciudades as dc on s.DeliveryCityID = dc.CityID
    where s.SupplierID = @id;
end;
go

-- Modulo Ventas 
-- Procedure para filtrar ventas
create procedure dbo.ModuloVentas
    @nombre_cliente nvarchar(100) = '',
    @fecha_inicio date = null,
    @fecha_fin date = null,
    @monto_min money = null,
    @monto_max money = null
as
begin
    set nocount on;

    select
        i.InvoiceID as numero_factura,
        i.InvoiceDate as fecha,
        c.CustomerName as cliente,
        dm.DeliveryMethodName as metodo_entrega,
        sum(il.Quantity * il.UnitPrice) as monto
    from dbo.facturas as i
    inner join dbo.lineas_factura as il on i.InvoiceID = il.InvoiceID
    left join dbo.clientes as c on i.CustomerID = c.CustomerID
    left join dbo.metodos_entrega as dm on i.DeliveryMethodID = dm.DeliveryMethodID
    where
        (c.CustomerName like '%' + @nombre_cliente + '%' or @nombre_cliente = '')
        and (i.InvoiceDate >= @fecha_inicio or @fecha_inicio is null)
        and (i.InvoiceDate <= @fecha_fin or @fecha_fin is null)
    group by i.InvoiceID, i.InvoiceDate, c.CustomerName, dm.DeliveryMethodName
    having
        (sum(il.Quantity * il.UnitPrice) >= @monto_min or @monto_min is null)
        and (sum(il.Quantity * il.UnitPrice) <= @monto_max or @monto_max is null)
    order by c.CustomerName asc;
end;
go

-- Procedure para encabezado de factura
create procedure dbo.EncabezadoFactura
    @id int
as
begin
    set nocount on;

    select 
        i.InvoiceID as numero_factura,
        i.CustomerID as id_cliente,
        c.CustomerName as nombre_cliente,
        dm.DeliveryMethodName as metodo_entrega,
        i.CustomerPurchaseOrderNumber as numero_orden,
        pc.FullName as persona_contacto,
        s.FullName as nombre_vendedor,
        i.InvoiceDate as fecha_factura,
        i.DeliveryInstructions as instrucciones_entrega
    from dbo.facturas as i
    inner join dbo.clientes as c on i.CustomerID = c.CustomerID
    left join dbo.metodos_entrega as dm on i.DeliveryMethodID = dm.DeliveryMethodID
    left join dbo.personas as pc on i.ContactPersonID = pc.PersonID
    left join dbo.personas as s on i.SalespersonPersonID = s.PersonID
    where i.InvoiceID = @id;
end;
go

-- Procedure para detalle de factura
create procedure dbo.DetalleFactura
    @id int
as
begin
    set nocount on;

    select
        il.StockItemID as id_producto,
        si.StockItemName as nombre_producto,
        il.Quantity as cantidad,
        il.UnitPrice as precio_unitario,
        il.TaxRate as impuesto_aplicado,
        il.TaxAmount as monto_impuesto,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as total_por_linea
    from dbo.lineas_factura as il
    inner join dbo.articulos as si on il.StockItemID = si.StockItemID
    where il.InvoiceID = @id;
end;
go



-- vista

-- Estadistica proveedores
create view dbo.estadistica1
as
    select
        oc.purchaseorderid as factura,
        pr.supplierid      as id_proveedor,
        pr.suppliername    as proveedor,
        cp.suppliercategoryname as categoria,
        sum(
            cast(coalesce(ol.orderedouters, 0) * coalesce(ol.expectedunitpriceperouter, 0.00) as decimal(19,4))
        ) as monto_orden
    from dbo.ordenes_compra       as oc
    inner join dbo.lineas_orden_compra as ol on oc.purchaseorderid = ol.purchaseorderid
    inner join dbo.proveedores     as pr on oc.supplierid = pr.supplierid
    left  join dbo.categorias_proveedor as cp on pr.suppliercategoryid = cp.suppliercategoryid
    group by
        oc.purchaseorderid,
        pr.supplierid,
        pr.suppliername,
        cp.suppliercategoryname;
go


-- Procedure para estadisticas de proveedores
-- estadisticas de proveedores
create procedure dbo.estadisticas_proveedores
    @nombre_proveedor nvarchar(100) = N'',
    @categoria nvarchar(100) = N''
as
begin
    set nocount on;

    select
        categoria = case when grouping(categoria) = 1 then N'total general' else categoria end,
        proveedor = case
                        when grouping(categoria) = 0 and grouping(proveedor) = 1 then N'subtotal categoría'
                        when grouping(categoria) = 1 and grouping(proveedor) = 1 then N'total general'
                        else proveedor
                    end,
        ordenes = count(*),
        monto_min = min(monto_orden),
        monto_max = max(monto_orden),
        monto_prom = avg(cast(monto_orden as decimal(19,4)))
    from dbo.estadistica1
    where
        (@nombre_proveedor = N'' or proveedor like N'%' + @nombre_proveedor + N'%')
        and (@categoria = N'' or categoria like N'%' + @categoria + N'%')
    group by rollup (categoria, proveedor)
    order by
        case when grouping(categoria) = 1 then 1 else 0 end,
        categoria,
        case when grouping(proveedor) = 1 then 1 else 0 end,
        proveedor;
end;
go





-- Procedure para listar categorias de clientes
create procedure dbo.categoriasClientes
as
begin
    set nocount on;
    select customercategoryname as categoria
     from dbo.categorias_cliente;
end;
go




-- Estadistica ventas
-- Procedure para estadisticas de ventas
create view dbo.estadistica2
as
    select
        f.invoiceid as factura,
        c.customerid as id_cliente,
        c.customername as cliente,
        cc.customercategoryname as categoria,
        sum(cast(coalesce(il.quantity, 0) * coalesce(il.unitprice, 0.00) + coalesce(il.taxamount, 0.00) as decimal(19,4))) as monto_factura
    from dbo.facturas as f
    inner join dbo.lineas_factura as il  on f.invoiceid = il.invoiceid
    inner join dbo.clientes as c on f.customerid = c.customerid
    left join dbo.categorias_cliente as cc on c.customercategoryid = cc.customercategoryid
    group by
        f.invoiceid,
        c.customerid,
        c.customername,
        cc.customercategoryname;
go

-- estadisticas de ventas
create procedure dbo.estadisticas_ventas
    @nombre_cliente nvarchar(100) = N'',
    @categoria nvarchar(100) = N''
as
begin
    set nocount on;

    select
        categoria = case when grouping(categoria) = 1 then N'total general' else categoria end,
        cliente = case
                    when grouping(categoria) = 0 and grouping(cliente) = 1 then N'subtotal categoría'
                    when grouping(categoria) = 1 and grouping(cliente)  = 1 then N'total general'
                    else cliente
                    end,
        facturas = count(*),
        venta_min = min(monto_factura),
        venta_max = max(monto_factura),
        venta_prom = avg(cast(monto_factura as decimal(19,4)))
    from dbo.estadistica2
    where
        (@nombre_cliente = N'' or cliente  like N'%' + @nombre_cliente + N'%')
        and (@categoria  = N'' or categoria like N'%' + @categoria      + N'%')
    group by rollup (categoria, cliente)
    order by
        case when grouping(categoria) = 1 then 1 else 0 end,
        categoria,
        case when grouping(cliente) = 1 then 1 else 0 end,
        cliente;
end;
go



-- estadistica inventario 

-- Procedure para estadisticas de inventario
create view dbo.estadistica3
as
    select
        year(f.invoicedate) as año,
        il.stockitemid as id_producto,
        si.stockitemname as producto,
        sum( cast((coalesce(il.unitprice, 0.00) - coalesce(sih.lastcostprice, 0.00))
                * coalesce(il.quantity, 0) as decimal(19,4))
        ) as ganancia_total
    from dbo.facturas as f
    inner join dbo.lineas_factura as il on f.invoiceid = il.invoiceid
    inner join dbo.articulos as si on il.stockitemid = si.stockitemid
    left join dbo.existencias as sih on si.stockitemid = sih.stockitemid
    group by
        year(f.invoicedate),
        il.stockitemid,
        si.stockitemname;
go

-- estadisticas de inventario
create procedure dbo.top5_productos
    @año int = null
as
begin
    set nocount on;

    ;with ranking as (
        select
            año,
            id_producto,
            producto,
            ganancia_total,
            dense_rank() over (partition by año order by ganancia_total desc) as posicion
        from dbo.estadistica3
        where (@año is null or año = @año)
    )
    select *
    from ranking
    where posicion <= 5
    order by año, posicion;
end;
go




-- Estadistica compras

-- Procedure para estadisticas de compras
create view dbo.estadistica4
as
    select
        year(f.invoicedate) as año,
        c.customerid as id_cliente,
        c.customername as cliente,
        count(distinct f.invoiceid) as cantidad_facturas,
        sum(
            cast(
                coalesce(il.quantity, 0) * coalesce(il.unitprice, 0) + coalesce(il.taxamount, 0)
            as decimal(19,4))
        ) as monto_total
    from dbo.facturas as f
    inner join dbo.lineas_factura as il on f.invoiceid = il.invoiceid
    inner join dbo.clientes as c on f.customerid = c.customerid
    group by
        year(f.invoicedate),
        c.customerid,
        c.customername;
go

create procedure dbo.top5_clientes
    @año_inicio int = null,
    @año_fin    int = null
as
begin
    set nocount on;

    ;with ranking as (
        select
            año,
            id_cliente,
            cliente,
            count(*) as cantidad_facturas,
            sum(monto_total) as monto_total,
            dense_rank() over (partition by año order by count(*) desc, sum(monto_total) desc) as posicion
        from dbo.estadistica4
        group by año, id_cliente, cliente
        having 
            (@año_inicio is null or año >= @año_inicio)
            and (@año_fin is null or año <= @año_fin)
    )
    select *
    from ranking
    where posicion <= 5
    order by año, posicion;
end;
go


-- Estadistica proveedores

-- Procedure para estadisticas de proveedores
create view dbo.estadistica5
as
    select
        year(po.orderdate) as año,
        s.supplierid as id_proveedor,
        s.suppliername as proveedor,
        count(distinct po.purchaseorderid) as cantidad_ordenes,
        sum(cast(coalesce(pol.orderedouters, 0) * coalesce(pol.expectedunitpriceperouter, 0) as decimal(19,4))
        ) as monto_total
    from dbo.ordenes_compra as po
    inner join dbo.lineas_orden_compra as pol on po.purchaseorderid = pol.purchaseorderid
    inner join dbo.proveedores as s on po.supplierid = s.supplierid
    group by
        year(po.orderdate),
        s.supplierid,
        s.suppliername;
go

create procedure dbo.top5_proveedores_ordenes
    @año_inicio int = null,
    @año_fin    int = null
as
begin
    set nocount on;
    ;with ranking as (
        select
            año,
            id_proveedor,
            proveedor,
            count(*) as cantidad_ordenes,
            sum(monto_total) as monto_total,
            dense_rank() over (partition by año order by count(*) desc, sum(monto_total) desc) as posicion
        from dbo.estadistica5
        group by año, id_proveedor, proveedor
        having
            (@año_inicio is null or año >= @año_inicio)
            and (@año_fin    is null or año <= @año_fin)
    )
    select *
    from ranking
    where posicion <= 5
    order by año, posicion;
end;
go


-- Modulo Inventario - CRUD
create procedure dbo.InsertarInventario
  @StockItemName nvarchar(100),
  @SupplierID int,
  @UnitPackageID int,
  @OuterPackageID int,
  @LeadTimeDays int,
  @QuantityPerOuter int,
  @IsChillerStock bit,
  @TaxRate decimal(18,3),
  @UnitPrice decimal(18,2),
  @TypicalWeightPerUnit decimal(18,3),
  @RecommendedRetailPrice decimal(18,2) = NULL,
  @ColorID int = NULL,
  @Brand nvarchar(50) = NULL,
  @Size nvarchar(20) = NULL,
  @Barcode nvarchar(50) = NULL,
  @MarketingComments nvarchar(max) = NULL,
  @InternalComments nvarchar(max) = NULL,
  @LastEditedBy int = 1,             
  @NewStockItemID int OUTPUT
as
begin
  set nocount on;

  INSERT INTO dbo.articulos
  (
    StockItemName, SupplierID, ColorID, UnitPackageID, OuterPackageID, Brand, Size,
    LeadTimeDays, QuantityPerOuter, IsChillerStock, Barcode, TaxRate, UnitPrice,
    RecommendedRetailPrice, TypicalWeightPerUnit, MarketingComments, InternalComments,
    LastEditedBy
  )
  VALUES
  (
    @StockItemName, @SupplierID, @ColorID, @UnitPackageID, @OuterPackageID, @Brand, @Size,
    @LeadTimeDays, @QuantityPerOuter, @IsChillerStock, @Barcode, @TaxRate, @UnitPrice,
    @RecommendedRetailPrice, @TypicalWeightPerUnit, @MarketingComments, @InternalComments,
    @LastEditedBy
  );

  set @NewStockItemID = convert(int, scope_identity());
  select @NewStockItemID as StockItemID;
end
go

-- Procedure para actualizar inventario
create procedure dbo.ActualizarInventario
    @StockItemID int,
    @StockItemName nvarchar(100),
    @SupplierID int,
    @UnitPackageID int,
    @OuterPackageID int,
    @LeadTimeDays int,
    @QuantityPerOuter int,
    @IsChillerStock bit,
    @TaxRate decimal(18,3),
    @UnitPrice decimal(18,2),
    @TypicalWeightPerUnit decimal(18,3),
    @RecommendedRetailPrice decimal(18,2) = null,
    @ColorID int = null,
    @Brand nvarchar(50) = null,
    @Size nvarchar(20) = null,
    @Barcode nvarchar(50) = null,
    @MarketingComments nvarchar(max) = null,
    @InternalComments nvarchar(max) = null
as
begin
    set nocount on;

    update dbo.articulos
        set StockItemName = @StockItemName,
                SupplierID = @SupplierID,
                ColorID = @ColorID,
                UnitPackageID = @UnitPackageID,
                OuterPackageID = @OuterPackageID,
                Brand = @Brand,
                Size = @Size,
                LeadTimeDays = @LeadTimeDays,
                QuantityPerOuter = @QuantityPerOuter,
                IsChillerStock = @IsChillerStock,
                Barcode = @Barcode,
                TaxRate = @TaxRate,
                UnitPrice = @UnitPrice,
                RecommendedRetailPrice = @RecommendedRetailPrice,
                TypicalWeightPerUnit = @TypicalWeightPerUnit,
                MarketingComments = @MarketingComments,
                InternalComments = @InternalComments
    where StockItemID = @StockItemID;

    select @@rowcount as Affected;
end
go

-- Procedure para eliminar inventario
create procedure dbo.eliminarInventario
  @StockItemID int
as
begin
  set nocount on;

  delete from dbo.articulos 
  where StockItemID = @StockItemID;

  select @@rowcount as Affected;
end
go
-- Procedures para listar datos foráneos
create procedure dbo.ListarProveedores
as
begin
  set nocount on;
  select 
    SupplierID as id,
    SupplierName as nombre
  from dbo.proveedores
  order by SupplierName;
end
go

-- Procedure para listar colores
create procedure dbo.ListarColores
as
begin
  set nocount on;
  select 
    ColorID as id,
    ColorName as nombre
  from dbo.colores
  order by ColorName;
end
go

-- Procedure para listar paquetes

create procedure dbo.ListarPaquetes
as
begin
  set nocount on;
  select 
    PackageTypeID as id,
    PackageTypeName as nombre
  from  dbo.tipos_empaque
  order by PackageTypeName;
end
go

-- Procedure para listar grupos de productos
create procedure dbo.ListarGruposProductos
as
begin
  set nocount on;
  select 
    StockGroupID as id,
    StockGroupName as nombre
  from dbo.grupos_articulo
  order by StockGroupName;
end
go

-- Procedure para obtener producto por ID
create procedure dbo.obtener_producto
    @StockItemID int
as
begin
set nocount on;
    select top (1)
        si.StockItemID,
        si.StockItemName,
        si.Brand,
        si.Size,
        si.Barcode,
        si.ColorID,
        c.ColorName as ColorNombre,
        si.SupplierID,
        p.SupplierName as ProveedorNombre,
        si.UnitPackageID,
        up.PackageTypeName as UnitPackageNombre,
        si.OuterPackageID,
        op.PackageTypeName as OuterPackageNombre,
        si.QuantityPerOuter,
        si.LeadTimeDays,
        si.TypicalWeightPerUnit,
        si.IsChillerStock,
        si.MarketingComments,
        si.InternalComments,
        si.UnitPrice,
        si.RecommendedRetailPrice,
        si.TaxRate
    from dbo.articulos as si
    left join dbo.colores as c on c.ColorID = si.ColorID
    left join dbo.proveedores as p on p.SupplierID = si.SupplierID
    left join dbo.tipos_empaque as up on up.PackageTypeID = si.UnitPackageID
    left join dbo.tipos_empaque as op on op.PackageTypeID = si.OuterPackageID
    where si.StockItemID = @StockItemID;
end;
go





use WideWorldImporters
go
select * from sales.invoices