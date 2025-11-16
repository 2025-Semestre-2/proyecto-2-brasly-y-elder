use wideworldimporters;
go

-- =====================
-- drop procedures
-- =====================
drop procedure if exists dbo.filtrarclientes;
drop procedure if exists dbo.categoriacliente;
drop procedure if exists dbo.detallecliente;
drop procedure if exists dbo.moduloinventario;
drop procedure if exists dbo.grupoinventario;
drop procedure if exists dbo.detalleproducto;
drop procedure if exists dbo.moduloproveedor;
drop procedure if exists dbo.categoriaproveedor;
drop procedure if exists dbo.detalleproveedor;
drop procedure if exists dbo.moduloventas;
drop procedure if exists dbo.encabezadofactura;
drop procedure if exists dbo.detallefactura;
drop procedure if exists dbo.estadisticas_proveedores;
drop procedure if exists dbo.categoriasclientes;
drop procedure if exists dbo.estadisticas_ventas;
drop procedure if exists dbo.top5_productos;
drop procedure if exists dbo.top5_clientes;
drop procedure if exists dbo.top5_proveedores_ordenes;
drop procedure if exists dbo.insertarinventario;
drop procedure if exists dbo.actualizarinventario;
drop procedure if exists dbo.eliminarinventario;
drop procedure if exists dbo.listarproveedores;
drop procedure if exists dbo.listarcolores;
drop procedure if exists dbo.listarpaquetes;
drop procedure if exists dbo.listargruposproductos;
drop procedure if exists dbo.obtener_producto;
go

-- =====================
-- drop views
-- =====================
drop view if exists dbo.estadistica1;
drop view if exists dbo.estadistica2;
drop view if exists dbo.estadistica3;
drop view if exists dbo.estadistica4;
drop view if exists dbo.estadistica5;
go

-- =====================
-- drop synonyms
-- =====================
drop synonym if exists dbo.facturas;
drop synonym if exists dbo.lineas_factura;
drop synonym if exists dbo.clientes;
drop synonym if exists dbo.categorias_cliente;
drop synonym if exists dbo.grupos_compra;
drop synonym if exists dbo.ordenes_compra;
drop synonym if exists dbo.lineas_orden_compra;
drop synonym if exists dbo.proveedores;
drop synonym if exists dbo.categorias_proveedor;
drop synonym if exists dbo.articulos;
drop synonym if exists dbo.grupos_articulo;
drop synonym if exists dbo.existencias;
drop synonym if exists dbo.transacciones_inventario;
drop synonym if exists dbo.colores;
drop synonym if exists dbo.tipos_empaque;
drop synonym if exists dbo.personas;
drop synonym if exists dbo.metodos_entrega;
drop synonym if exists dbo.metodos_pago;
drop synonym if exists dbo.tipos_transaccion;
drop synonym if exists dbo.ciudades;
drop synonym if exists dbo.estados_provincia;
drop synonym if exists dbo.paises;
go


use wideworldimporters;
go

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

create or alter view dbo.estadistica1
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

create or alter view dbo.estadistica2
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

create or alter view dbo.estadistica3
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

create or alter view dbo.estadistica4
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

create or alter view dbo.estadistica5
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
