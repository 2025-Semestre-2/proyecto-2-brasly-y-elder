use wideworldimporters;
go

-- modulo cliente 

create or alter procedure dbo.filtrarclientes
    @nombre nvarchar(100) = '',
    @categoria nvarchar(100) = '',
    @entrega nvarchar(100) = ''
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        c.customerid as id,
        c.customername as nombre_cliente,
        cc.customercategoryname as categoria,
        dm.deliverymethodname as metodo_entrega
    from dbo.clientes as c
    left join dbo.categorias_cliente as cc on c.customercategoryid = cc.customercategoryid
    left join dbo.metodos_entrega as dm on c.deliverymethodid = dm.deliverymethodid
    where
        (c.customername like '%' + @nombre + '%' or @nombre = '')
        and (cc.customercategoryname like '%' + @categoria + '%' or @categoria = '')
        and (dm.deliverymethodname like '%' + @entrega + '%' or @entrega = '')
    order by c.customername asc;
end;
go

create or alter procedure dbo.categoriacliente
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select customercategoryname as categorias
    from dbo.categorias_cliente;
end;
go

create or alter procedure dbo.detallecliente
    @customerid int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select 
        c.customerid as id,
        c.customername as cliente,
        cc.customercategoryname as categoria,
        bg.buyinggroupname as grupocompra,
        p.fullname as contactoprimario,
        pa.fullname as contactoalternativo,
        c.billtocustomerid as clientefacturarid,
        dm.deliverymethodname as metodo_entrega,
        dc.cityname as ciudentrega,
        c.deliverypostalcode as codigopostal,
        c.phonenumber as telefono,
        c.faxnumber as fax,
        c.paymentdays as diasgraciapago,
        c.websiteurl as sitioweb,
        c.deliveryaddressline1 as direccionentrega,
        c.deliveryaddressline2 as direccionentrega2,
        c.postaladdressline1 as direccionpostal,
        c.postaladdressline2 as direccionpostal2,
        c.deliverylocation.Lat as latitud,
        c.deliverylocation.Long as longitud
    from dbo.clientes as c
    left join dbo.categorias_cliente as cc on c.customercategoryid = cc.customercategoryid
    left join dbo.grupos_compra as bg on c.buyinggroupid = bg.buyinggroupid
    left join dbo.personas as p on c.primarycontactpersonid = p.personid
    left join dbo.personas as pa on c.alternatecontactpersonid = pa.personid
    left join dbo.metodos_entrega as dm on c.deliverymethodid = dm.deliverymethodid
    left join dbo.ciudades as dc on c.deliverycityid = dc.cityid
    where c.customerid = @customerid;
end;
go

-- modulo inventario 

create or alter procedure dbo.moduloinventario
    @nombre nvarchar(100) = '',
    @grupo nvarchar(100) = ''
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        si.stockitemid as id,
        si.stockitemname as nombreproducto,
        string_agg(sg.stockgroupname, ', ') as grupos,
        isnull(sih.quantityonhand, 0) as cantidad
    from dbo.articulos as si
    left join dbo.existencias as sih
        on si.stockitemid = sih.stockitemid
    left join warehouse.stockitemstockgroups as sisg
        on si.stockitemid = sisg.stockitemid
    left join dbo.grupos_articulo as sg
        on sisg.stockgroupid = sg.stockgroupid
       and (@grupo = '' or sg.stockgroupname like '%' + @grupo + '%')
    where (@nombre = '' or si.stockitemname like '%' + @nombre + '%')
    group by si.stockitemid, si.stockitemname, isnull(sih.quantityonhand, 0)
    order by si.stockitemname asc;
end;
go

create or alter procedure dbo.grupoinventario
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select stockgroupname as grupos
    from dbo.grupos_articulo;
end;
go

create or alter procedure dbo.detalleproducto
    @id int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        si.stockitemid as idproducto,
        si.stockitemname as nombreproducto,
        s.suppliername as nombreproveedor,
        c.colorname as color,
        pt.packagetypename as unidadempaquetamiento,
        pt.packagetypename as empaquetamiento,
        si.quantityperouter as cantidadporempaquetamiento,
        si.brand as marca,
        si.size as talla,
        si.taxrate as impuesto,
        si.unitprice as preciounitario,
        si.recommendedretailprice as precioventa,
        si.typicalweightperunit as peso,
        si.searchdetails as palabrasclave,
        sih.quantityonhand as cantidaddisponible,
        sih.binlocation as ubicacion
    from dbo.articulos as si
    left join dbo.proveedores as s on si.supplierid = s.supplierid
    left join dbo.colores as c on si.colorid = c.colorid
    left join dbo.tipos_empaque as pt on si.unitpackageid = pt.packagetypeid
    left join dbo.existencias as sih on si.stockitemid = sih.stockitemid
    where si.stockitemid = @id;
end;
go

-- modulo proveedor 

create or alter procedure dbo.moduloproveedor
    @nombre nvarchar(100) = '',
    @categoria nvarchar(100) = '',
    @entrega nvarchar(100) = ''
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        s.supplierid as id_proveedor,
        s.suppliername as nombre_proveedor,
        sc.suppliercategoryname as categoria,
        dm.deliverymethodname as metodo_entrega
    from dbo.proveedores as s
    left join dbo.categorias_proveedor as sc on s.suppliercategoryid = sc.suppliercategoryid
    left join dbo.metodos_entrega as dm on s.deliverymethodid = dm.deliverymethodid
    where
        (s.suppliername like '%' + @nombre + '%' or @nombre = '')
        and (sc.suppliercategoryname like '%' + @categoria + '%' or @categoria = '')
        and (dm.deliverymethodname like '%' + @entrega + '%' or @entrega = '')
    order by s.suppliername asc;
end;
go

create or alter procedure dbo.categoriaproveedor
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select suppliercategoryname as catproveedores
    from dbo.categorias_proveedor;
end;
go

create or alter procedure dbo.detalleproveedor
    @id int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        s.supplierid as id,
        s.supplierreference as referencia,
        s.suppliername as nombreproveedor,
        sc.suppliercategoryname as categoria,
        pc.personid as primariocontactoid,
        pc.fullname as primariocontactonombre,
        pc.phonenumber as primariocontactonumero,
        pc.emailaddress as primariocontactoemail,
        ac.personid as alternativocontactoid,
        ac.fullname as alternativocontactonombre,
        ac.phonenumber as alternativocontactonumero,
        ac.emailaddress as alternativocontactoemail,
        dm.deliverymethodname as metodo_entrega,
        dc.cityname as ciudentrega,
        s.deliverypostalcode as codigopostal,
        s.phonenumber as telefono,
        s.faxnumber as fax,
        s.websiteurl as sitioweb,
        s.deliveryaddressline1,
        s.deliveryaddressline2,
        s.postaladdressline1,
        s.postaladdressline2,
        s.postalpostalcode,
        s.deliverylocation.Lat as latitud,
        s.deliverylocation.Long as longitud,
        s.bankaccountname as nombrebanco,
        s.bankaccountbranch as sucursalbanco,
        s.bankaccountcode as codigobanco,
        s.bankaccountnumber as numerocuenta,
        s.bankinternationalcode as codigointernacional,
        s.paymentdays as diaspago
    from dbo.proveedores as s
    left join dbo.categorias_proveedor as sc on s.suppliercategoryid = sc.suppliercategoryid
    left join dbo.personas as pc on s.primarycontactpersonid = pc.personid
    left join dbo.personas as ac on s.alternatecontactpersonid = ac.personid
    left join dbo.metodos_entrega as dm on s.deliverymethodid = dm.deliverymethodid
    left join dbo.ciudades as dc on s.deliverycityid = dc.cityid
    where s.supplierid = @id;
end;
go

-- modulo ventas 

create or alter procedure dbo.moduloventas
    @nombre_cliente nvarchar(100) = '',
    @fecha_inicio date = null,
    @fecha_fin date = null,
    @monto_min money = null,
    @monto_max money = null
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        i.invoiceid as numero_factura,
        i.invoicedate as fecha,
        c.customername as cliente,
        dm.deliverymethodname as metodo_entrega,
        sum(il.quantity * il.unitprice) as monto
    from dbo.facturas as i
    inner join dbo.lineas_factura as il on i.invoiceid = il.invoiceid
    left join dbo.clientes as c on i.customerid = c.customerid
    left join dbo.metodos_entrega as dm on i.deliverymethodid = dm.deliverymethodid
    where
        (c.customername like '%' + @nombre_cliente + '%' or @nombre_cliente = '')
        and (i.invoicedate >= @fecha_inicio or @fecha_inicio is null)
        and (i.invoicedate <= @fecha_fin or @fecha_fin is null)
    group by i.invoiceid, i.invoicedate, c.customername, dm.deliverymethodname
    having
        (sum(il.quantity * il.unitprice) >= @monto_min or @monto_min is null)
        and (sum(il.quantity * il.unitprice) <= @monto_max or @monto_max is null)
    order by c.customername asc;
end;
go

create or alter procedure dbo.encabezadofactura
    @id int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select 
        i.invoiceid as numero_factura,
        i.customerid as id_cliente,
        c.customername as nombre_cliente,
        dm.deliverymethodname as metodo_entrega,
        i.customerpurchaseordernumber as numero_orden,
        pc.fullname as persona_contacto,
        s.fullname as nombre_vendedor,
        i.invoicedate as fecha_factura,
        i.deliveryinstructions as instrucciones_entrega
    from dbo.facturas as i
    inner join dbo.clientes as c on i.customerid = c.customerid
    left join dbo.metodos_entrega as dm on i.deliverymethodid = dm.deliverymethodid
    left join dbo.personas as pc on i.contactpersonid = pc.personid
    left join dbo.personas as s on i.salespersonpersonid = s.personid
    where i.invoiceid = @id;
end;
go

create or alter procedure dbo.detallefactura
    @id int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select
        il.stockitemid as id_producto,
        si.stockitemname as nombre_producto,
        il.quantity as cantidad,
        il.unitprice as precio_unitario,
        il.taxrate as impuesto_aplicado,
        il.taxamount as monto_impuesto,
        (il.quantity * il.unitprice + il.taxamount) as total_por_linea
    from dbo.lineas_factura as il
    inner join dbo.articulos as si on il.stockitemid = si.stockitemid
    where il.invoiceid = @id;
end;
go

-- estadística

create or alter procedure dbo.estadisticas_proveedores
    @nombre_proveedor nvarchar(100) = N'',
    @categoria nvarchar(100) = N''
as
begin
    set nocount on;
    set transaction isolation level read committed;

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

create or alter procedure dbo.categoriasclientes
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select customercategoryname as categoria
    from dbo.categorias_cliente;
end;
go

create or alter procedure dbo.estadisticas_ventas
    @nombre_cliente nvarchar(100) = N'',
    @categoria nvarchar(100) = N''
as
begin
    set nocount on;
    set transaction isolation level read committed;

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
        (@nombre_cliente = N'' or cliente like N'%' + @nombre_cliente + N'%')
        and (@categoria = N'' or categoria like N'%' + @categoria + N'%')
    group by rollup (categoria, cliente)
    order by
        case when grouping(categoria) = 1 then 1 else 0 end,
        categoria,
        case when grouping(cliente) = 1 then 1 else 0 end,
        cliente;
end;
go


create or alter procedure dbo.top5_productos
    @año int = null
as
begin
    set nocount on;
    set transaction isolation level read committed;

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

create or alter procedure dbo.top5_clientes
    @año_inicio int = null,
    @año_fin    int = null
as
begin
    set nocount on;
    set transaction isolation level read committed;

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

create or alter procedure dbo.top5_proveedores_ordenes
    @año_inicio int = null,
    @año_fin    int = null
as
begin
    set nocount on;
    set transaction isolation level read committed;

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

-- crud inventario

create or alter procedure dbo.insertarinventario
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
  @recommendedretailprice decimal(18,2) = null,
  @colorid int = null,
  @brand nvarchar(50) = null,
  @size nvarchar(20) = null,
  @barcode nvarchar(50) = null,
  @marketingcomments nvarchar(max) = null,
  @internalcomments nvarchar(max) = null,
  @lasteditedby int = 1,             
  @newstockitemid int output
as
begin
  set nocount on;
  set transaction isolation level read committed;

  insert into dbo.articulos
  (
    stockitemname, supplierid, colorid, unitpackageid, outerpackageid, brand, size,
    leadtimedays, quantityperouter, ischillerstock, barcode, taxrate, unitprice,
    recommendedretailprice, typicalweightperunit, marketingcomments, internalcomments,
    lasteditedby
  )
  values
  (
    @stockitemname, @supplierid, @colorid, @unitpackageid, @outerpackageid, @brand, @size,
    @leadtimedays, @quantityperouter, @ischillerstock, @barcode, @taxrate, @unitprice,
    @recommendedretailprice, @typicalweightperunit, @marketingcomments, @internalcomments,
    @lasteditedby
  );

  set @newstockitemid = convert(int, scope_identity());
  select @newstockitemid as stockitemid;
end
go

create or alter procedure dbo.actualizarinventario
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
    @recommendedretailprice decimal(18,2) = null,
    @colorid int = null,
    @brand nvarchar(50) = null,
    @size nvarchar(20) = null,
    @barcode nvarchar(50) = null,
    @marketingcomments nvarchar(max) = null,
    @internalcomments nvarchar(max) = null
as
begin
    set nocount on;
    set transaction isolation level read committed;

    update dbo.articulos
        set stockitemname = @stockitemname,
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
    where stockitemid = @stockitemid;

    select @@rowcount as affected;
end
go

create or alter procedure dbo.eliminarinventario
  @stockitemid int
as
begin
  set nocount on;
  set transaction isolation level read committed;

  delete from dbo.articulos 
  where stockitemid = @stockitemid;

  select @@rowcount as affected;
end
go

create or alter procedure dbo.listarproveedores
as
begin
  set nocount on;
  set transaction isolation level read committed;

  select 
    supplierid as id,
    suppliername as nombre
  from dbo.proveedores
  order by suppliername;
end
go

create or alter procedure dbo.listarcolores
as
begin
  set nocount on;
  set transaction isolation level read committed;

  select 
    colorid as id,
    colorname as nombre
  from dbo.colores
  order by colorname;
end
go

create or alter procedure dbo.listarpaquetes
as
begin
  set nocount on;
  set transaction isolation level read committed;

  select 
    packagetypeid as id,
    packagetypename as nombre
  from  dbo.tipos_empaque
  order by packagetypename;
end
go

create or alter procedure dbo.listargruposproductos
as
begin
  set nocount on;
  set transaction isolation level read committed;

  select 
    stockgroupid as id,
    stockgroupname as nombre
  from dbo.grupos_articulo
  order by stockgroupname;
end
go

create or alter procedure dbo.obtener_producto
    @stockitemid int
as
begin
    set nocount on;
    set transaction isolation level read committed;

    select top (1)
        si.stockitemid,
        si.stockitemname,
        si.brand,
        si.size,
        si.barcode,
        si.colorid,
        c.colorname as colornombre,
        si.supplierid,
        p.suppliername as proveedornombre,
        si.unitpackageid,
        up.packagetypename as unitpackagenombre,
        si.outerpackageid,
        op.packagetypename as outerpackagenombre,
        si.quantityperouter,
        si.leadtimedays,
        si.typicalweightperunit,
        si.ischillerstock,
        si.marketingcomments,
        si.internalcomments,
        si.unitprice,
        si.recommendedretailprice,
        si.taxrate
    from dbo.articulos as si
    left join dbo.colores as c on c.colorid = si.colorid
    left join dbo.proveedores as p on p.supplierid = si.supplierid
    left join dbo.tipos_empaque as up on up.packagetypeid = si.unitpackageid
    left join dbo.tipos_empaque as op on op.packagetypeid = si.outerpackageid
    where si.stockitemid = @stockitemid;
end;
go
