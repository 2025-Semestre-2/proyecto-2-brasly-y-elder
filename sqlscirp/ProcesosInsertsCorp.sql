USE WideWorldImporters;
GO


---------------------------------------------------------------
-- INVENTARIO
---------------------------------------------------------------
IF OBJECT_ID('dbo.StockItems_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.StockItems_SJ;
CREATE SYNONYM dbo.StockItems_SJ FOR Srv_SanJose.WideWorldImporters.Warehouse.StockItems;

IF OBJECT_ID('dbo.StockItemHoldings_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.StockItemHoldings_SJ;
CREATE SYNONYM dbo.StockItemHoldings_SJ FOR Srv_SanJose.WideWorldImporters.Warehouse.StockItemHoldings;

IF OBJECT_ID('dbo.StockItems_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.StockItems_LI;
CREATE SYNONYM dbo.StockItems_LI FOR Srv_Limon.WideWorldImporters.Warehouse.StockItems;

IF OBJECT_ID('dbo.StockItemHoldings_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.StockItemHoldings_LI;
CREATE SYNONYM dbo.StockItemHoldings_LI FOR Srv_Limon.WideWorldImporters.Warehouse.StockItemHoldings;


---------------------------------------------------------------
-- CLIENTES
---------------------------------------------------------------
IF OBJECT_ID('dbo.Customers_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.Customers_SJ;
CREATE SYNONYM dbo.Customers_SJ FOR Srv_SanJose.WideWorldImporters.Sales.Customers;

IF OBJECT_ID('dbo.CustomerCategories_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.CustomerCategories_SJ;
CREATE SYNONYM dbo.CustomerCategories_SJ FOR Srv_SanJose.WideWorldImporters.Sales.CustomerCategories;

IF OBJECT_ID('dbo.Customers_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.Customers_LI;
CREATE SYNONYM dbo.Customers_LI FOR Srv_Limon.WideWorldImporters.Sales.Customers;

IF OBJECT_ID('dbo.CustomerCategories_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.CustomerCategories_LI;
CREATE SYNONYM dbo.CustomerCategories_LI FOR Srv_Limon.WideWorldImporters.Sales.CustomerCategories;


---------------------------------------------------------------
-- PROVEEDORES (para uso futuro)
---------------------------------------------------------------
IF OBJECT_ID('dbo.Suppliers_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.Suppliers_SJ;
CREATE SYNONYM dbo.Suppliers_SJ FOR Srv_SanJose.WideWorldImporters.Purchasing.Suppliers;

IF OBJECT_ID('dbo.SupplierCategories_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.SupplierCategories_SJ;
CREATE SYNONYM dbo.SupplierCategories_SJ FOR Srv_SanJose.WideWorldImporters.Purchasing.SupplierCategories;

IF OBJECT_ID('dbo.Suppliers_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.Suppliers_LI;
CREATE SYNONYM dbo.Suppliers_LI FOR Srv_Limon.WideWorldImporters.Purchasing.Suppliers;

IF OBJECT_ID('dbo.SupplierCategories_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.SupplierCategories_LI;
CREATE SYNONYM dbo.SupplierCategories_LI FOR Srv_Limon.WideWorldImporters.Purchasing.SupplierCategories;


---------------------------------------------------------------
-- APOYO COMÚN
---------------------------------------------------------------
IF OBJECT_ID('dbo.DeliveryMethods_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.DeliveryMethods_SJ;
CREATE SYNONYM dbo.DeliveryMethods_SJ FOR Srv_SanJose.WideWorldImporters.Application.DeliveryMethods;

IF OBJECT_ID('dbo.People_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.People_SJ;
CREATE SYNONYM dbo.People_SJ FOR Srv_SanJose.WideWorldImporters.Application.People;

IF OBJECT_ID('dbo.Cities_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.Cities_SJ;
CREATE SYNONYM dbo.Cities_SJ FOR Srv_SanJose.WideWorldImporters.Application.Cities;


IF OBJECT_ID('dbo.DeliveryMethods_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.DeliveryMethods_LI;
CREATE SYNONYM dbo.DeliveryMethods_LI FOR Srv_Limon.WideWorldImporters.Application.DeliveryMethods;

IF OBJECT_ID('dbo.People_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.People_LI;
CREATE SYNONYM dbo.People_LI FOR Srv_Limon.WideWorldImporters.Application.People;

IF OBJECT_ID('dbo.Cities_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.Cities_LI;
CREATE SYNONYM dbo.Cities_LI FOR Srv_Limon.WideWorldImporters.Application.Cities;


---------------------------------------------------------------
-- VENTAS (invoices + lines)
---------------------------------------------------------------
IF OBJECT_ID('dbo.Invoices_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.Invoices_SJ;
CREATE SYNONYM dbo.Invoices_SJ FOR Srv_SanJose.WideWorldImporters.Sales.Invoices;

IF OBJECT_ID('dbo.InvoiceLines_SJ', 'SN') IS NOT NULL DROP SYNONYM dbo.InvoiceLines_SJ;
CREATE SYNONYM dbo.InvoiceLines_SJ FOR Srv_SanJose.WideWorldImporters.Sales.InvoiceLines;

IF OBJECT_ID('dbo.Invoices_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.Invoices_LI;
CREATE SYNONYM dbo.Invoices_LI FOR Srv_Limon.WideWorldImporters.Sales.Invoices;

IF OBJECT_ID('dbo.InvoiceLines_LI', 'SN') IS NOT NULL DROP SYNONYM dbo.InvoiceLines_LI;
CREATE SYNONYM dbo.InvoiceLines_LI FOR Srv_Limon.WideWorldImporters.Sales.InvoiceLines;
GO

/* ============================================================
   2. INVENTARIO: VISTAS POR SUCURSAL + DISTRIBUIDA
   ============================================================ */

-- Corporativo
CREATE OR ALTER VIEW dbo.vw_articulos_Corp AS
SELECT
    'CORP' AS sucursal,
    si.StockItemID       AS stockitemid,
    si.StockItemName     AS stockitemname,
    si.Brand             AS brand,
    si.[Size]            AS size,
    si.UnitPrice         AS unitprice,
    si.QuantityPerOuter  AS quantityperouter,
    sih.QuantityOnHand   AS quantityonhand
FROM Warehouse.StockItems si
LEFT JOIN Warehouse.StockItemHoldings sih
    ON si.StockItemID = sih.StockItemID;
GO

-- San José (por sinónimos)
CREATE OR ALTER VIEW dbo.vw_articulos_SJ AS
SELECT
    'SANJOSE' AS sucursal,
    si.StockItemID       AS stockitemid,
    si.StockItemName     AS stockitemname,
    si.Brand             AS brand,
    si.[Size]            AS size,
    si.UnitPrice         AS unitprice,
    si.QuantityPerOuter  AS quantityperouter,
    sih.QuantityOnHand   AS quantityonhand
FROM dbo.StockItems_SJ si
LEFT JOIN dbo.StockItemHoldings_SJ sih
    ON si.StockItemID = sih.StockItemID;
GO

-- Limón (por sinónimos)
CREATE OR ALTER VIEW dbo.vw_articulos_LI AS
SELECT
    'LIMON' AS sucursal,
    si.StockItemID       AS stockitemid,
    si.StockItemName     AS stockitemname,
    si.Brand             AS brand,
    si.[Size]            AS size,
    si.UnitPrice         AS unitprice,
    si.QuantityPerOuter  AS quantityperouter,
    sih.QuantityOnHand   AS quantityonhand
FROM dbo.StockItems_LI si
LEFT JOIN dbo.StockItemHoldings_LI sih
    ON si.StockItemID = sih.StockItemID;
GO

-- Vista distribuida
CREATE OR ALTER VIEW dbo.vw_articulos_distribuido AS
SELECT * FROM dbo.vw_articulos_Corp
UNION ALL
SELECT * FROM dbo.vw_articulos_SJ
UNION ALL
SELECT * FROM dbo.vw_articulos_LI;
GO


/* ============================================================
   3. INVENTARIO: SP DISTRIBUIDOS
   ============================================================ */

-- Listado distribuido
CREATE OR ALTER PROCEDURE dbo.sp_moduloinventario_distribuido
    @nombre   NVARCHAR(100) = N'',
    @sucursal NVARCHAR(20)  = N'TODAS'   -- 'TODAS','CORP','SANJOSE','LIMON'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        stockitemid      AS id,
        stockitemname    AS nombreproducto,
        brand,
        [size],
        unitprice,
        quantityperouter,
        quantityonhand   AS cantidad,
        sucursal
    FROM dbo.vw_articulos_distribuido
    WHERE
        (@sucursal = N'TODAS' OR sucursal = @sucursal)
        AND (@nombre = N'' OR stockitemname LIKE N'%' + @nombre + N'%')
    ORDER BY sucursal, stockitemname;
END;
GO


-- Detalle distribuido por sucursal
CREATE OR ALTER PROCEDURE dbo.sp_detalleproducto_distribuido
    @id       INT,
    @sucursal NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @dbprefix SYSNAME;

    SET @dbprefix = CASE UPPER(@sucursal)
        WHEN 'CORP'    THEN 'WideWorldImporters'
        WHEN 'SANJOSE' THEN 'Srv_SanJose.WideWorldImporters'
        WHEN 'LIMON'   THEN 'Srv_Limon.WideWorldImporters'
    END;

    DECLARE @sql NVARCHAR(MAX) = N'
    SELECT
        si.StockItemID              AS stockitemid,
        si.StockItemName            AS stockitemname,
        si.Brand                    AS brand,
        si.[Size]                   AS size,
        si.UnitPrice                AS unitprice,
        si.RecommendedRetailPrice   AS recommendedretailprice,
        si.TaxRate                  AS taxrate,
        si.SearchDetails            AS searchdetails,
        sih.QuantityOnHand          AS quantityonhand,
        ''' + @sucursal + N'''      AS sucursal
    FROM ' + @dbprefix + N'.Warehouse.StockItems si
    LEFT JOIN ' + @dbprefix + N'.Warehouse.StockItemHoldings sih
        ON si.StockItemID = sih.StockItemID
    WHERE si.StockItemID = @id;';

    EXEC sp_executesql @sql,
        N'@id int',
        @id = @id;
END;
GO


/* ============================================================
   4. CLIENTES: VISTAS POR SUCURSAL + DISTRIBUIDA
   ============================================================ */
   ------------------------------------------------------------
-- CLIENTES: CORP
------------------------------------------------------------
CREATE OR ALTER VIEW dbo.vw_clientes_Corp AS
SELECT
    'CORP'                     AS sucursal,
    c.CustomerID               AS customerid,
    c.CustomerName             AS customername,
    cc.CustomerCategoryName    AS customercategoryname,
    dm.DeliveryMethodName      AS deliverymethodname
FROM Sales.Customers c
LEFT JOIN Sales.CustomerCategories cc
    ON c.CustomerCategoryID = cc.CustomerCategoryID
LEFT JOIN Application.DeliveryMethods dm
    ON c.DeliveryMethodID = dm.DeliveryMethodID;
GO



------------------------------------------------------------
-- CLIENTES: SAN JOSÉ
------------------------------------------------------------
CREATE OR ALTER VIEW dbo.vw_clientes_SJ AS
SELECT
    'SANJOSE' AS sucursal,
    q.CustomerID          AS customerid,
    q.CustomerName        AS customername,
    q.CustomerCategoryName AS customercategoryname,
    q.DeliveryMethodName   AS deliverymethodname
FROM OPENQUERY(Srv_SanJose,
'
    SELECT 
        c.CustomerID,
        c.CustomerName,
        cc.CustomerCategoryName,
        dm.DeliveryMethodName
    FROM WideWorldImporters.Sales.Customers c
    LEFT JOIN WideWorldImporters.Sales.CustomerCategories cc
        ON c.CustomerCategoryID = cc.CustomerCategoryID
    LEFT JOIN WideWorldImporters.Application.DeliveryMethods dm
        ON c.DeliveryMethodID = dm.DeliveryMethodID
') AS q;
GO




------------------------------------------------------------
-- CLIENTES: LIMÓN
------------------------------------------------------------
CREATE OR ALTER VIEW dbo.vw_clientes_LI AS
SELECT
    'LIMON' AS sucursal,
    q.CustomerID          AS customerid,
    q.CustomerName        AS customername,
    q.CustomerCategoryName AS customercategoryname,
    q.DeliveryMethodName   AS deliverymethodname
FROM OPENQUERY(Srv_Limon,
'
    SELECT 
        c.CustomerID,
        c.CustomerName,
        cc.CustomerCategoryName,
        dm.DeliveryMethodName
    FROM WideWorldImporters.Sales.Customers c
    LEFT JOIN WideWorldImporters.Sales.CustomerCategories cc
        ON c.CustomerCategoryID = cc.CustomerCategoryID
    LEFT JOIN WideWorldImporters.Application.DeliveryMethods dm
        ON c.DeliveryMethodID = dm.DeliveryMethodID
') AS q;
GO




------------------------------------------------------------
-- CLIENTES DISTRIBUIDOS
------------------------------------------------------------
CREATE OR ALTER VIEW dbo.vw_clientes_distribuido AS
SELECT * FROM dbo.vw_clientes_Corp
UNION ALL
SELECT * FROM dbo.vw_clientes_SJ
UNION ALL
SELECT * FROM dbo.vw_clientes_LI;
GO



/* ============================================================
   5. CLIENTES: SP DISTRIBUIDOS
   ============================================================ */

-- Filtro distribuido de clientes
CREATE OR ALTER PROCEDURE dbo.sp_filtrarclientes_distribuido
    @nombre    NVARCHAR(100) = N'',
    @categoria NVARCHAR(100) = N'',
    @entrega   NVARCHAR(100) = N'',
    @sucursal  NVARCHAR(20)  = N'TODAS'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        customerid              AS id,
        customername            AS nombre_cliente,
        customercategoryname    AS categoria,
        deliverymethodname      AS metodo_entrega,
        sucursal
    FROM dbo.vw_clientes_distribuido
    WHERE
        (@sucursal = N'TODAS' OR sucursal = @sucursal)
        AND (@nombre    = N'' OR customername         LIKE N'%' + @nombre    + N'%')
        AND (@categoria = N'' OR customercategoryname LIKE N'%' + @categoria + N'%')
        AND (@entrega   = N'' OR deliverymethodname   LIKE N'%' + @entrega   + N'%')
    ORDER BY sucursal, customername;
END;
GO


-- Detalle distribuido de cliente
CREATE OR ALTER PROCEDURE dbo.sp_detallecliente_distribuido
    @customerid INT,
    @sucursal   NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @dbprefix SYSNAME;

    SET @dbprefix = CASE UPPER(@sucursal)
        WHEN 'CORP'    THEN 'WideWorldImporters'
        WHEN 'SANJOSE' THEN 'Srv_SanJose.WideWorldImporters'
        WHEN 'LIMON'   THEN 'Srv_Limon.WideWorldImporters'
    END;

    DECLARE @sql NVARCHAR(MAX) = N'
    SELECT 
        c.CustomerID                AS id,
        c.CustomerName              AS cliente,
        cc.CustomerCategoryName     AS categoria,
        bg.BuyingGroupName          AS grupocompra,
        p.FullName                  AS contactoprimario,
        pa.FullName                 AS contactoalternativo,
        c.BillToCustomerID          AS clientefacturarid,
        dm.DeliveryMethodName       AS metodo_entrega,
        dc.CityName                 AS ciudentrega,
        c.DeliveryPostalCode        AS codigopostal,
        c.PhoneNumber               AS telefono,
        c.FaxNumber                 AS fax,
        c.PaymentDays               AS diasgraciapago,
        c.WebsiteURL                AS sitioweb,
        c.DeliveryAddressLine1      AS direccionentrega,
        c.DeliveryAddressLine2      AS direccionentrega2,
        c.PostalAddressLine1        AS direccionpostal,
        c.PostalAddressLine2        AS direccionpostal2,
        ''' + @sucursal + N'''      AS sucursal
    FROM ' + @dbprefix + N'.Sales.Customers c
    LEFT JOIN ' + @dbprefix + N'.Sales.CustomerCategories cc
        ON c.CustomerCategoryID = cc.CustomerCategoryID
    LEFT JOIN ' + @dbprefix + N'.Sales.BuyingGroups bg
        ON c.BuyingGroupID = bg.BuyingGroupID
    LEFT JOIN ' + @dbprefix + N'.Application.People p
        ON c.PrimaryContactPersonID = p.PersonID
    LEFT JOIN ' + @dbprefix + N'.Application.People pa
        ON c.AlternateContactPersonID = pa.PersonID
    LEFT JOIN ' + @dbprefix + N'.Application.DeliveryMethods dm
        ON c.DeliveryMethodID = dm.DeliveryMethodID
    LEFT JOIN ' + @dbprefix + N'.Application.Cities dc
        ON c.DeliveryCityID = dc.CityID
    WHERE c.CustomerID = @customerid;';

    EXEC sp_executesql @sql,
        N'@customerid int',
        @customerid = @customerid;
END;
GO

----para estadisticas

use WideWorldImporters;
go

create or alter view dbo.vw_ventas_detalle_distribuida as
    -- CORP
    select
        'CORP'                                  as sucursal,
        i.InvoiceID                             as invoiceid,
        i.InvoiceDate                           as invoicedate,
        year(i.InvoiceDate)                     as anio,
        month(i.InvoiceDate)                    as mes,
        c.CustomerID                            as customerid,
        c.CustomerName                          as customername,
        il.StockItemID                          as stockitemid,
        si.StockItemName                        as stockitemname,
        il.Quantity                             as quantity,
        il.UnitPrice                            as unitprice,
        il.TaxAmount                            as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                         as stockgroupid,
        sg.StockGroupName                       as stockgroupname
    from Sales.Invoices i
    join Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join Sales.Customers c
        on i.CustomerID = c.CustomerID
    join Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID

    union all

    -- SAN JOSE (OPENQUERY)
    select
        q.sucursal,
        q.invoiceid,
        q.invoicedate,
        q.anio,
        q.mes,
        q.customerid,
        q.customername,
        q.stockitemid,
        q.stockitemname,
        q.quantity,
        q.unitprice,
        q.taxamount,
        q.monto_linea,
        q.stockgroupid,
        q.stockgroupname
    from openquery(Srv_SanJose,
'
    select
        ''SANJOSE''                              as sucursal,
        i.InvoiceID                              as invoiceid,
        i.InvoiceDate                            as invoicedate,
        year(i.InvoiceDate)                      as anio,
        month(i.InvoiceDate)                     as mes,
        c.CustomerID                             as customerid,
        c.CustomerName                           as customername,
        il.StockItemID                           as stockitemid,
        si.StockItemName                         as stockitemname,
        il.Quantity                              as quantity,
        il.UnitPrice                             as unitprice,
        il.TaxAmount                             as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                          as stockgroupid,
        sg.StockGroupName                        as stockgroupname
    from WideWorldImporters.Sales.Invoices i
    join WideWorldImporters.Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join WideWorldImporters.Sales.Customers c
        on i.CustomerID = c.CustomerID
    join WideWorldImporters.Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join WideWorldImporters.Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join WideWorldImporters.Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID
') as q

    union all

    -- LIMON (OPENQUERY)
    select
        q.sucursal,
        q.invoiceid,
        q.invoicedate,
        q.anio,
        q.mes,
        q.customerid,
        q.customername,
        q.stockitemid,
        q.stockitemname,
        q.quantity,
        q.unitprice,
        q.taxamount,
        q.monto_linea,
        q.stockgroupid,
        q.stockgroupname
    from openquery(Srv_Limon,
'
    select
        ''LIMON''                                as sucursal,
        i.InvoiceID                              as invoiceid,
        i.InvoiceDate                            as invoicedate,
        year(i.InvoiceDate)                      as anio,
        month(i.InvoiceDate)                     as mes,
        c.CustomerID                             as customerid,
        c.CustomerName                           as customername,
        il.StockItemID                           as stockitemid,
        si.StockItemName                         as stockitemname,
        il.Quantity                              as quantity,
        il.UnitPrice                             as unitprice,
        il.TaxAmount                             as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                          as stockgroupid,
        sg.StockGroupName                        as stockgroupname
    from WideWorldImporters.Sales.Invoices i
    join WideWorldImporters.Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join WideWorldImporters.Sales.Customers c
        on i.CustomerID = c.CustomerID
    join WideWorldImporters.Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join WideWorldImporters.Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join WideWorldImporters.Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID
') as q;
go

use WideWorldImporters;
go

create or alter view dbo.vw_ventas_detalle_distribuida as
    -- CORP
    select
        'CORP'                                  as sucursal,
        i.InvoiceID                             as invoiceid,
        i.InvoiceDate                           as invoicedate,
        year(i.InvoiceDate)                     as anio,
        month(i.InvoiceDate)                    as mes,
        c.CustomerID                            as customerid,
        c.CustomerName                          as customername,
        il.StockItemID                          as stockitemid,
        si.StockItemName                        as stockitemname,
        il.Quantity                             as quantity,
        il.UnitPrice                            as unitprice,
        il.TaxAmount                            as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                         as stockgroupid,
        sg.StockGroupName                       as stockgroupname
    from Sales.Invoices i
    join Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join Sales.Customers c
        on i.CustomerID = c.CustomerID
    join Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID

    union all

    -- SAN JOSE (OPENQUERY)
    select
        q.sucursal,
        q.invoiceid,
        q.invoicedate,
        q.anio,
        q.mes,
        q.customerid,
        q.customername,
        q.stockitemid,
        q.stockitemname,
        q.quantity,
        q.unitprice,
        q.taxamount,
        q.monto_linea,
        q.stockgroupid,
        q.stockgroupname
    from openquery(Srv_SanJose,
'
    select
        ''SANJOSE''                              as sucursal,
        i.InvoiceID                              as invoiceid,
        i.InvoiceDate                            as invoicedate,
        year(i.InvoiceDate)                      as anio,
        month(i.InvoiceDate)                     as mes,
        c.CustomerID                             as customerid,
        c.CustomerName                           as customername,
        il.StockItemID                           as stockitemid,
        si.StockItemName                         as stockitemname,
        il.Quantity                              as quantity,
        il.UnitPrice                             as unitprice,
        il.TaxAmount                             as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                          as stockgroupid,
        sg.StockGroupName                        as stockgroupname
    from WideWorldImporters.Sales.Invoices i
    join WideWorldImporters.Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join WideWorldImporters.Sales.Customers c
        on i.CustomerID = c.CustomerID
    join WideWorldImporters.Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join WideWorldImporters.Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join WideWorldImporters.Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID
') as q

    union all

    -- LIMON (OPENQUERY)
    select
        q.sucursal,
        q.invoiceid,
        q.invoicedate,
        q.anio,
        q.mes,
        q.customerid,
        q.customername,
        q.stockitemid,
        q.stockitemname,
        q.quantity,
        q.unitprice,
        q.taxamount,
        q.monto_linea,
        q.stockgroupid,
        q.stockgroupname
    from openquery(Srv_Limon,
'
    select
        ''LIMON''                                as sucursal,
        i.InvoiceID                              as invoiceid,
        i.InvoiceDate                            as invoicedate,
        year(i.InvoiceDate)                      as anio,
        month(i.InvoiceDate)                     as mes,
        c.CustomerID                             as customerid,
        c.CustomerName                           as customername,
        il.StockItemID                           as stockitemid,
        si.StockItemName                         as stockitemname,
        il.Quantity                              as quantity,
        il.UnitPrice                             as unitprice,
        il.TaxAmount                             as taxamount,
        (il.Quantity * il.UnitPrice + il.TaxAmount) as monto_linea,
        sg.StockGroupID                          as stockgroupid,
        sg.StockGroupName                        as stockgroupname
    from WideWorldImporters.Sales.Invoices i
    join WideWorldImporters.Sales.InvoiceLines il
        on i.InvoiceID = il.InvoiceID
    join WideWorldImporters.Sales.Customers c
        on i.CustomerID = c.CustomerID
    join WideWorldImporters.Warehouse.StockItems si
        on il.StockItemID = si.StockItemID
    left join WideWorldImporters.Warehouse.StockItemStockGroups sisg
        on si.StockItemID = sisg.StockItemID
    left join WideWorldImporters.Warehouse.StockGroups sg
        on sisg.StockGroupID = sg.StockGroupID
') as q;
go


-----Top 5 productos 

create or alter procedure dbo.sp_top5_productos
    @anio      int          = null,
    @sucursal  nvarchar(20) = N'TODAS'   -- 'CORP','SANJOSE','LIMON','TODAS'
as
begin
    set nocount on;
    set transaction isolation level read committed;

    if @sucursal = N'TODAS'
    begin
        ;with ventas as (
            select *
            from dbo.vw_ventas_detalle_distribuida
            where (@anio is null or anio = @anio)
        ),
        agregados as (
            select
                'GLOBAL'          as sucursal,
                stockitemid,
                stockitemname,
                sum(quantity)     as cantidad_total,
                sum(monto_linea)  as monto_total
            from ventas
            group by stockitemid, stockitemname
        ),
        ranking as (
            select
                sucursal,
                stockitemid,
                stockitemname,
                cantidad_total,
                monto_total,
                dense_rank() over (order by monto_total desc) as posicion
            from agregados
        )
        select *
        from ranking
        where posicion <= 5
        order by posicion, stockitemname;
    end
    else
    begin
        ;with ventas as (
            select *
            from dbo.vw_ventas_detalle_distribuida
            where (@anio is null or anio = @anio)
              and sucursal = @sucursal
        ),
        agregados as (
            select
                sucursal,
                stockitemid,
                stockitemname,
                sum(quantity)    as cantidad_total,
                sum(monto_linea) as monto_total
            from ventas
            group by sucursal, stockitemid, stockitemname
        ),
        ranking as (
            select
                sucursal,
                stockitemid,
                stockitemname,
                cantidad_total,
                monto_total,
                dense_rank() over (order by monto_total desc) as posicion
            from agregados
        )
        select *
        from ranking
        where posicion <= 5
        order by posicion, stockitemname;
    end
end;
go

--- top 5 clientes

create or alter procedure dbo.sp_top5_clientes
    @anio      int          = null,
    @sucursal  nvarchar(20) = N'TODAS'
as
begin
    set nocount on;
    set transaction isolation level read committed;

    if @sucursal = N'TODAS'
    begin
        ;with ventas as (
            select *
            from dbo.vw_ventas_detalle_distribuida
            where (@anio is null or anio = @anio)
        ),
        agregados as (
            select
                'GLOBAL'          as sucursal,
                customerid,
                customername,
                count(distinct invoiceid) as cantidad_facturas,
                sum(monto_linea)          as monto_total
            from ventas
            group by customerid, customername
        ),
        ranking as (
            select
                sucursal,
                customerid,
                customername,
                cantidad_facturas,
                monto_total,
                dense_rank() over (order by monto_total desc) as posicion
            from agregados
        )
        select *
        from ranking
        where posicion <= 5
        order by posicion, customername;
    end
    else
    begin
        ;with ventas as (
            select *
            from dbo.vw_ventas_detalle_distribuida
            where (@anio is null or anio = @anio)
              and sucursal = @sucursal
        ),
        agregados as (
            select
                sucursal,
                customerid,
                customername,
                count(distinct invoiceid) as cantidad_facturas,
                sum(monto_linea)          as monto_total
            from ventas
            group by sucursal, customerid, customername
        ),
        ranking as (
            select
                sucursal,
                customerid,
                customername,
                cantidad_facturas,
                monto_total,
                dense_rank() over (order by monto_total desc) as posicion
            from agregados
        )
        select *
        from ranking
        where posicion <= 5
        order by posicion, customername;
    end
end;
go

--ventas por sucursal 
create or alter procedure dbo.sp_ventas_por_sucursal
    @fecha_inicio date = null,
    @fecha_fin    date = null,
    @sucursal     nvarchar(20) = N'TODAS'
as
begin
    set nocount on;
    set transaction isolation level read committed;

    ;with ventas as (
        select *
        from dbo.vw_ventas_detalle_distribuida
        where (@fecha_inicio is null or invoicedate >= @fecha_inicio)
          and (@fecha_fin    is null or invoicedate <= @fecha_fin)
          and (@sucursal = N'TODAS' or sucursal = @sucursal)
    )
    select
        sucursal,
        count(distinct invoiceid) as cantidad_facturas,
        sum(quantity)             as unidades_totales,
        sum(monto_linea)          as monto_total
    from ventas
    group by sucursal
    order by sucursal;
end;
go

---ventas por mes 
create or alter procedure dbo.sp_ventas_por_mes
    @anio_inicio int = null,
    @anio_fin    int = null,
    @sucursal    nvarchar(20) = N'TODAS'
as
begin
    set nocount on;
    set transaction isolation level read committed;

    ;with ventas as (
        select *
        from dbo.vw_ventas_detalle_distribuida
        where (@anio_inicio is null or anio >= @anio_inicio)
          and (@anio_fin    is null or anio <= @anio_fin)
          and (@sucursal = N'TODAS' or sucursal = @sucursal)
    )
    select
        sucursal,
        anio,
        mes,
        sum(monto_linea)          as monto_total,
        count(distinct invoiceid) as cantidad_facturas
    from ventas
    group by sucursal, anio, mes
    order by anio, mes, sucursal;
end;
go


---ventas por categoria 

create or alter procedure dbo.sp_ventas_por_categoria
    @anio      int          = null,
    @sucursal  nvarchar(20) = N'TODAS'
as
begin
    set nocount on;
    set transaction isolation level read committed;

    ;with ventas as (
        select *
        from dbo.vw_ventas_detalle_distribuida
        where (@anio is null or anio = @anio)
          and (@sucursal = N'TODAS' or sucursal = @sucursal)
    )
    select
        sucursal,
        isnull(stockgroupname, N'sin categoría') as categoria,
        sum(monto_linea)                         as monto_total,
        sum(quantity)                            as unidades_total
    from ventas
    group by sucursal, stockgroupname
    order by sucursal, monto_total desc;
end;
go
