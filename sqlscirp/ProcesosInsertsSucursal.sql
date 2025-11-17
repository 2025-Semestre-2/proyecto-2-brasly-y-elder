USE WideWorldImporters;
GO

------------------------------------------------------------------------------------
-- CRUD INVENTARIO (EXCLUSIVO DE SUCURSALES)
------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE dbo.insertarinventario
  @stockitemname nvarchar(100),
  @supplierid int,
  @unitpackageid int,
  @outerpackageid int,
  @leadtimedays int,
  @quantityperouter int,
  @ischillerstock bit,
  @taxrate decimal(18,3),
  @unitprice decimal(18,2),
  @typicalweightperunit decimal(18,3),
  @recommendedretailprice decimal(18,2) = NULL,
  @colorid int = NULL,
  @brand nvarchar(50) = NULL,
  @size nvarchar(20) = NULL,
  @barcode nvarchar(50) = NULL,
  @marketingcomments nvarchar(max) = NULL,
  @internalcomments nvarchar(max) = NULL,
  @lasteditedby int = 1,
  @newstockitemid int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO warehouse.stockitems (
      stockitemname, supplierid, colorid,
      unitpackageid, outerpackageid, brand, size,
      leadtimedays, quantityperouter, ischillerstock,
      barcode, taxrate, unitprice, recommendedretailprice,
      typicalweightperunit, marketingcomments, internalcomments,
      lasteditedby
    )
    VALUES (
      @stockitemname, @supplierid, @colorid,
      @unitpackageid, @outerpackageid, @brand, @size,
      @leadtimedays, @quantityperouter, @ischillerstock,
      @barcode, @taxrate, @unitprice, @recommendedretailprice,
      @typicalweightperunit, @marketingcomments, @internalcomments,
      @lasteditedby
    );

    SET @newstockitemid = CONVERT(int, SCOPE_IDENTITY());
    SELECT @newstockitemid AS stockitemid;
END;
GO


CREATE OR ALTER PROCEDURE dbo.actualizarinventario
  @stockitemid int,
  @stockitemname nvarchar(100),
  @supplierid int,
  @unitpackageid int,
  @outerpackageid int,
  @leadtimedays int,
  @quantityperouter int,
  @ischillerstock bit,
  @taxrate decimal(18,3),
  @unitprice decimal(18,2),
  @typicalweightperunit decimal(18,3),
  @recommendedretailprice decimal(18,2) = NULL,
  @colorid int = NULL,
  @brand nvarchar(50) = NULL,
  @size nvarchar(20) = NULL,
  @barcode nvarchar(50) = NULL,
  @marketingcomments nvarchar(max) = NULL,
  @internalcomments nvarchar(max) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE warehouse.stockitems
    SET stockitemname = @stockitemname,
        supplierid = @supplierid,
        colorid = @colorid,
        unitpackageid = @unitpackageid,
        outerpackageid = @outerpackageid,
        brand = @brand,
        size = @size,
        leadtimedays = @leadtimedays,
        quantityperouter = @quantityperouter,
        ischillerstock = @ischillerstock,
        barcode = @barcode,
        taxrate = @taxrate,
        unitprice = @unitprice,
        recommendedretailprice = @recommendedretailprice,
        typicalweightperunit = @typicalweightperunit,
        marketingcomments = @marketingcomments,
        internalcomments = @internalcomments
    WHERE stockitemid = @stockitemid;

    SELECT @@ROWCOUNT AS affected;
END;
GO


CREATE OR ALTER PROCEDURE dbo.eliminarinventario
  @stockitemid int
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM warehouse.stockitems
    WHERE stockitemid = @stockitemid;

    SELECT @@ROWCOUNT AS affected;
END;
GO


------------------------------------------------------------------------------------
-- HELPERS PARA COMBOS EN SUCURSAL
------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE dbo.listarproveedores
AS
BEGIN
    SET NOCOUNT ON;

    SELECT supplierid AS id,
           suppliername AS nombre
    FROM purchasing.suppliers
    ORDER BY suppliername;
END;
GO


CREATE OR ALTER PROCEDURE dbo.listarcolores
AS
BEGIN
    SET NOCOUNT ON;

    SELECT colorid AS id,
           colorname AS nombre
    FROM warehouse.colors
    ORDER BY colorname;
END;
GO


CREATE OR ALTER PROCEDURE dbo.listarpaquetes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT packagetypeid AS id,
           packagetypename AS nombre
    FROM warehouse.packageTypes
    ORDER BY packagetypename;
END;
GO


CREATE OR ALTER PROCEDURE dbo.listargruposproductos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT stockgroupid AS id,
           stockgroupname AS nombre
    FROM warehouse.stockgroups
    ORDER BY stockgroupname;
END;
GO


CREATE OR ALTER PROCEDURE dbo.obtener_producto
    @stockitemid int
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (1)
        si.stockitemid,
        si.stockitemname,
        si.brand,
        si.size,
        si.barcode,
        si.colorid,
        c.colorname AS colornombre,
        si.supplierid,
        p.suppliername AS proveedornombre,
        si.unitpackageid,
        up.packagetypename AS unitpackagenombre,
        si.outerpackageid,
        op.packagetypename AS outerpackagenombre,
        si.quantityperouter,
        si.leadtimedays,
        si.typicalweightperunit,
        si.ischillerstock,
        si.marketingcomments,
        si.internalcomments,
        si.unitprice,
        si.recommendedretailprice,
        si.taxrate
    FROM warehouse.stockitems AS si
    LEFT JOIN warehouse.colors          AS c  ON c.colorid         = si.colorid
    LEFT JOIN purchasing.suppliers      AS p  ON p.supplierid      = si.supplierid
    LEFT JOIN warehouse.packageTypes    AS up ON up.packagetypeid  = si.unitpackageid
    LEFT JOIN warehouse.packageTypes    AS op ON op.packagetypeid  = si.outerpackageid
    WHERE si.stockitemid = @stockitemid;
END;
GO


------------------------------------------------------------------------------------
-- VISTA LOCAL DE INVENTARIO (PARA DEBUG EN SUCURSAL)
------------------------------------------------------------------------------------

CREATE OR ALTER VIEW dbo.vw_articulos_local AS
SELECT
    si.stockitemid,
    si.stockitemname,
    si.unitprice,
    si.recommendedretailprice,
    si.colorid,
    si.unitpackageid,
    si.outerpackageid,
    si.quantityperouter,
    si.brand,
    si.size,
    sih.quantityonhand
FROM warehouse.stockitems si
LEFT JOIN warehouse.stockitemholdings sih
    ON si.stockitemid = sih.stockitemid;
GO

use WideWorldImporters
go 
create or alter procedure dbo.ListarColores
as
begin
    set nocount on;

    select 
        ColorID as id,
        ColorName as nombre
    from Warehouse.Colors
    order by ColorName;
end;
go

create or alter procedure dbo.ListarGruposProductos
as
begin
    set nocount on;

    select 
        StockGroupID as id,
        StockGroupName as nombre
    from Warehouse.StockGroups
    order by StockGroupName;
end;
go
create or alter procedure dbo.ListarProveedores
as
begin
    set nocount on;

    select 
        SupplierID as id,
        SupplierName as nombre
    from Purchasing.Suppliers
    order by SupplierName;
end;
go
create or alter procedure dbo.ListarCategoriasClientes
as
begin
    set nocount on;

    select 
        CustomerCategoryID as id,
        CustomerCategoryName as categoria
    from Sales.CustomerCategories
    order by CustomerCategoryName;
end;
go
create or alter procedure dbo.ListarCategoriasProveedores
as
begin
    set nocount on;

    select 
        SupplierCategoryID as id,
        SupplierCategoryName as categoria
    from Purchasing.SupplierCategories
    order by SupplierCategoryName;
end;
go
create or alter procedure dbo.GrupoInventario
as
begin
    set nocount on;

    select 
        StockGroupID as id,
        StockGroupName as grupo
    from Warehouse.StockGroups
    order by StockGroupName;
end;
go
