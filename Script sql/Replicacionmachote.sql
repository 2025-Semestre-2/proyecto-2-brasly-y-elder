/* ================================================================
   PROYECTO 2 - BASES DE DATOS II
   REPLICACIÓN TRANSACCIONAL DE PRODUCTOS
   Publicador: WideWorldImporters
   Suscriptores: WWILimon, WWISanJose
   Contraseña: ELP7030520*
   ================================================================ */


----------------------------------------------------------
-- 1️⃣ CREAR BASES DE DATOS SUCURSALES (SI NO EXISTEN)
----------------------------------------------------------
USE master;
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WWILimon')
BEGIN
    CREATE DATABASE WWILimon;
    PRINT '✅ Base WWILimon creada.';
END
ELSE
    PRINT 'ℹ️ Base WWILimon ya existe.';
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WWISanJose')
BEGIN
    CREATE DATABASE WWISanJose;
    PRINT '✅ Base WWISanJose creada.';
END
ELSE
    PRINT 'ℹ️ Base WWISanJose ya existe.';
GO


----------------------------------------------------------
-- 2️⃣ CONFIGURAR EL DISTRIBUIDOR (SOLO UNA VEZ)
----------------------------------------------------------
USE master;
GO
DECLARE @distributor SYSNAME = @@SERVERNAME;

EXEC sp_adddistributor 
    @distributor = @distributor, 
    @password = N'Elp703080520*';
GO

EXEC sp_adddistributiondb 
    @database = N'distribution',
    @data_folder = N'/var/opt/mssql/data',
    @log_folder = N'/var/opt/mssql/data',
    @security_mode = 1;
GO

USE distribution;
GO

EXEC sp_adddistpublisher 
    @publisher = N'MSI-STEALTH-14STUDIO-A13VF',  -- tu servidor
    @distribution_db = N'distribution',
    @security_mode = 0,
    @login = N'sa',
    @password = N'Elp703080520*',
    @publisher_type = N'MSSQLSERVER';
GO

PRINT '✅ Publicador re-registrado correctamente en el distribuidor.';



----------------------------------------------------------
-- 3️⃣ HABILITAR WIDEWORLDIMPORTERS COMO PUBLICADOR
----------------------------------------------------------
USE master;
GO

-- 🔧 Forzar a WideWorldImporters a estar publicada
EXEC sp_replicationdboption 
    @dbname = N'WideWorldImporters',
    @optname = N'publish',
    @value = N'true';
GO

-- 🔧 Registrar nuevamente el distribuidor
DECLARE @distributor SYSNAME = @@SERVERNAME;

EXEC sp_adddistributor 
    @distributor = @distributor, 
    @password = N'Elp703080520*';
GO


-- 4️⃣ CREAR PUBLICACIÓN: "CATALOGO-PRODUCTOS"

----------------------------------------------------------
USE [WideWorldImporters];
GO

EXEC sp_addpublication 
    @publication = N'CATALOGO-PRODUCTOS',
    @status = N'active',
    @allow_push = N'true',
    @allow_pull = N'true',
    @repl_freq = N'continuous',
    @description = N'Catálogo corporativo de productos y proveedores',
    @retention = 0,
    @immediate_sync = N'true',
    @independent_agent = N'true';
GO

PRINT '✅ Publicación CATALOGO-PRODUCTOS creada correctamente.';
GO


----------------------------------------------------------
-- 5️⃣ AGREGAR ARTÍCULOS (SOLO PRODUCTOS Y RELACIONADOS)
----------------------------------------------------------
-- Productos
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Warehouse_StockItems',
    @source_owner = N'Warehouse',
    @source_object = N'StockItems',
    @type = N'logbased';

-- Asociación productos–grupos
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Warehouse_StockItemStockGroups',
    @source_owner = N'Warehouse',
    @source_object = N'StockItemStockGroups',
    @type = N'logbased';

-- Grupos (categorías)
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Warehouse_StockGroups',
    @source_owner = N'Warehouse',
    @source_object = N'StockGroups',
    @type = N'logbased';

-- Colores
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Warehouse_Colors',
    @source_owner = N'Warehouse',
    @source_object = N'Colors',
    @type = N'logbased';

-- Tipos de empaques
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Warehouse_PackageTypes',
    @source_owner = N'Warehouse',
    @source_object = N'PackageTypes',
    @type = N'logbased';

-- Proveedores
EXEC sp_addarticle 
    @publication = N'CATALOGO-PRODUCTOS',
    @article = N'Purchasing_Suppliers',
    @source_owner = N'Purchasing',
    @source_object = N'Suppliers',
    @type = N'logbased';
GO

PRINT '✅ Artículos agregados a la publicación de productos.';
GO

------------------------------------
USE [WideWorldImporters];
GO

EXEC sp_addpublication_snapshot 
    @publication = N'CATALOGO-PRODUCTOS',
    @frequency_type = 4,               -- diario
    @frequency_interval = 1,
    @frequency_subday = 1,
    @frequency_subday_interval = 5,
    @active_start_time_of_day = 0,
    @active_end_time_of_day = 235959,
    @active_start_date = 20251108,
    @active_end_date = 99991231,
    
    -- 🔧 Autenticación del publicador (SQL Auth)
    @publisher_login = N'sa',
    @publisher_password = N'Elp703080520*',
    @publisher_security_mode = 0;  -- 0 = SQL Server Authentication
GO

PRINT '✅ Snapshot Agent creado correctamente en Linux (sin credenciales de Windows).';
GO


-- 🔧 Generar snapshot inicial de la publicación
EXEC sp_startpublication_snapshot 
    @publication = N'CATALOGO-PRODUCTOS';
GO

----------------------------------------------------------
-- 6️⃣ AGREGAR SUCURSALES COMO SUSCRIPTORES
----------------------------------------------------------
USE [WideWorldImporters];
GO

-- Sucursal Limón
EXEC sp_addsubscription 
    @publication = N'CATALOGO-PRODUCTOS',
    @subscriber = N'WWILimon',
    @destination_db = N'WWILimon',
    @subscription_type = N'Push',
    @sync_type = N'automatic',
    @update_mode = N'read only',
    @subscriber_type = 0;  -- Servidor SQL estándar
GO

-- Sucursal San José
EXEC sp_addsubscription 
    @publication = N'CATALOGO-PRODUCTOS',
    @subscriber = N'WWISanJose',
    @destination_db = N'WWISanJose',
    @subscription_type = N'Push',
    @sync_type = N'automatic',
    @update_mode = N'read only',
    @subscriber_type = 0;
GO

PRINT '✅ Suscripciones WWILimon y WWISanJose agregadas correctamente.';
GO



----------------------------------------------------------
-- 7️⃣ VERIFICACIÓN FINAL
----------------------------------------------------------
EXEC sp_helppublication;
GO
EXEC sp_helparticle @publication = N'CATALOGO-PRODUCTOS';
GO

PRINT '🎯 Replicación de catálogo de productos configurada correctamente.';
GO

---
USE WideWorldImporters;
GO
EXEC sp_helppublication;
USE [WideWorldImporters];
GO
EXEC sp_startpublication_snapshot 
    @publication = N'CATALOGO-PRODUCTOS';
GO





USE [WideWorldImporters];
GO

EXEC sp_startpublication_snapshot 
    @publication = N'CATALOGO-PRODUCTOS';
GO

EXEC sp_replmonitorhelppublication;
