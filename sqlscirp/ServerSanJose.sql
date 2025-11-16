USE [WideWorldImporters]


ALTER TABLE Warehouse.StockItems
SET (SYSTEM_VERSIONING = OFF);
ALTER TABLE Warehouse.StockItems
DROP PERIOD FOR SYSTEM_TIME;
ALTER TABLE Warehouse.StockItems
DROP COLUMN ValidFrom,
             ValidTo;
GO


ALTER TABLE Sales.CustomerCategories
SET (SYSTEM_VERSIONING = OFF);
ALTER TABLE Sales.CustomerCategories
DROP PERIOD FOR SYSTEM_TIME;
ALTER TABLE Sales.CustomerCategories
DROP COLUMN ValidFrom,
             ValidTo;
GO

ALTER TABLE Purchasing.Suppliers
SET (SYSTEM_VERSIONING = OFF);
ALTER TABLE Purchasing.Suppliers
DROP PERIOD FOR SYSTEM_TIME;
ALTER TABLE Purchasing.Suppliers
DROP COLUMN ValidFrom,
             ValidTo;
GO

ALTER TABLE Purchasing.SupplierCategories
SET (SYSTEM_VERSIONING = OFF);
ALTER TABLE Purchasing.SupplierCategories
DROP PERIOD FOR SYSTEM_TIME;
ALTER TABLE Purchasing.SupplierCategories
DROP COLUMN ValidFrom,
             ValidTo;
GO

ALTER TABLE Sales.Customers SET (SYSTEM_VERSIONING = OFF); 
ALTER TABLE Sales.Customers
DROP PERIOD FOR SYSTEM_TIME;
ALTER TABLE Sales.Customers
DROP COLUMN ValidFrom,
             ValidTo;
GO



CREATE TABLE [Sales].[Customers_ReplicaSucursales](
    [CustomerID] INT NOT NULL,
    [CustomerCategoryID] INT NOT NULL,
    [BillToCustomerID] INT NOT NULL,
    [DeliveryMethodID] INT NOT NULL,
    CONSTRAINT [PK_Customers_ReplicaSucursales] 
        PRIMARY KEY CLUSTERED ([CustomerID] ASC)
);
GO


-- 5. ejecutar luego de hacer subscriptor

-- DEL

USE [WideWorldImporters]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_MSdel_WarehouseStockItems]
		@pkc1 int
as
begin  

	IF EXISTS (SELECT 1 FROM [Warehouse].[StockItems] WHERE [StockItemID] = @pkc1)
	BEGIN
		DELETE FROM Sales.OrderLines 
		WHERE StockItemID = @pkc1;

		DELETE FROM Sales.InvoiceLines 
		WHERE StockItemID = @pkc1;

		DELETE FROM Warehouse.StockItemTransactions 
		WHERE StockItemID = @pkc1;

		DELETE FROM Warehouse.StockItemHoldings 
		WHERE StockItemID = @pkc1;

		DELETE FROM Purchasing.PurchaseOrderLines 
		WHERE StockItemID = @pkc1;

		DELETE FROM Warehouse.StockItems 
		WHERE StockItemID = @pkc1;
	END
	ELSE
	BEGIN
		PRINT 'El registro no existe en la tabla.';
	END

end  
GO

-- INSERT

USE [WideWorldImporters]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_MSins_WarehouseStockItems]
    @c1 INT,
    @c2 NVARCHAR(100),
    @c3 INT,
    @c4 INT,
    @c5 INT,
    @c6 INT,
    @c7 NVARCHAR(50),
    @c8 NVARCHAR(20),
    @c9 INT,
    @c10 INT,
    @c11 BIT,
    @c12 NVARCHAR(50),
    @c13 DECIMAL(18,3),
    @c14 DECIMAL(18,2),
    @c15 DECIMAL(18,2),
    @c16 DECIMAL(18,3),
    @c17 NVARCHAR(MAX),
    @c18 NVARCHAR(MAX),
    @c19 VARBINARY(MAX),
    @c20 NVARCHAR(MAX),
    @c21 INT
AS
BEGIN  
    -- Verificar si el registro NO existe antes de insertarlo
    IF NOT EXISTS (SELECT 1 FROM [Warehouse].[StockItems] WHERE [StockItemID] = @c1)
    BEGIN
        INSERT INTO [Warehouse].[StockItems] (
            [StockItemID],
            [StockItemName],
            [SupplierID],
            [ColorID],
            [UnitPackageID],
            [OuterPackageID],
            [Brand],
            [Size],
            [LeadTimeDays],
            [QuantityPerOuter],
            [IsChillerStock],
            [Barcode],
            [TaxRate],
            [UnitPrice],
            [RecommendedRetailPrice],
            [TypicalWeightPerUnit],
            [MarketingComments],
            [InternalComments],
            [Photo],
            [CustomFields],
            [LastEditedBy]
        ) VALUES (
            @c1,
            @c2,
            @c3,
            @c4,
            @c5,
            @c6,
            @c7,
            @c8,
            @c9,
            @c10,
            @c11,
            @c12,
            @c13,
            @c14,
            @c15,
            @c16,
            @c17,
            @c18,
            @c19,
            @c20,
            @c21
        );
    END
    ELSE
    BEGIN
        PRINT 'El registro con ese StockItemID ya existe. No se realizará la inserción.';
    END
END
GO



USE [WideWorldImporters]
GO
/****** Object:  StoredProcedure [dbo].[sp_MSdel_WarehouseStockItemStockGroups]    Script Date: 4/11/2024 20:40:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_MSdel_WarehouseStockItemStockGroups]
    @pkc1 int
AS
BEGIN  
    DECLARE @primarykey_text nvarchar(100) = '';

    -- Verificar si existe el StockItemStockGroupID antes de intentar eliminar
    IF EXISTS (SELECT 1 FROM [Warehouse].[StockItemStockGroups] WHERE [StockItemStockGroupID] = @pkc1)
    BEGIN
        DELETE FROM [Warehouse].[StockItemStockGroups] 
        WHERE [StockItemStockGroupID] = @pkc1;

        IF @@ROWCOUNT = 0
        BEGIN
            IF @@MICROSOFTVERSION > 0x07320000
            BEGIN
                IF EXISTS (SELECT * FROM sys.all_parameters WHERE object_id = OBJECT_ID('sp_MSreplraiserror') AND [name] = '@param3')
                BEGIN
                    SET @primarykey_text = @primarykey_text + '[StockItemStockGroupID] = ' + CONVERT(nvarchar(100), @pkc1, 1);
                    EXEC sp_MSreplraiserror @errorid = 20598, @param1 = N'[Warehouse].[StockItemStockGroups]', @param2 = @primarykey_text, @param3 = 13234; 
                END
                ELSE
                BEGIN
                    EXEC sp_MSreplraiserror @errorid = 20598;
                END
            END
        END
    END
END;
GO


USE [WideWorldImporters]
GO
/****** Object:  StoredProcedure [dbo].[sp_MSins_WarehouseStockItemStockGroups]    Script Date: 4/11/2024 22:13:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_MSins_WarehouseStockItemStockGroups]
    @c1 int,
    @c2 int,
    @c3 int,
    @c4 int,
    @c5 datetime2
as
begin  

	if not exists (SELECT 1 FROM [Warehouse].[StockItemStockGroups] WHERE [StockItemID] = @c2 and [StockGroupID] = @c3)
	begin
		insert into [Warehouse].[StockItemStockGroups] (
			[StockItemStockGroupID],
			[StockItemID],
			[StockGroupID],
			[LastEditedBy],
			[LastEditedWhen]
		) values (
			@c1,
			@c2,
			@c3,
			@c4,
			@c5	) 
	end
end  




ALTER PROCEDURE [dbo].[sp_MSdel_WarehouseStockItemHoldings]
    @pkc1 int
AS
BEGIN
    DECLARE @primarykey_text nvarchar(100) = '';

    IF EXISTS (SELECT 1 FROM Warehouse.StockItemHoldings WHERE StockItemID = @pkc1)
    BEGIN
        DELETE FROM Warehouse.StockItemHoldings
        WHERE StockItemID = @pkc1;
    END
    ELSE
    BEGIN
        RETURN; -- No error, no loop, no conflicto
    END

    IF @@ROWCOUNT = 0 AND @@MICROSOFTVERSION > 0x07320000
    BEGIN
        IF EXISTS (
            SELECT * FROM sys.all_parameters 
            WHERE object_id = OBJECT_ID('sp_MSreplraiserror') 
            AND [name] = '@param3'
        )
        BEGIN
            SET @primarykey_text = '[StockItemID] = ' + CONVERT(nvarchar(100), @pkc1, 1);
            EXEC sp_MSreplraiserror 
                @errorid = 20598,
                @param1 = N'[Warehouse].[StockItemHoldings]', 
                @param2 = @primarykey_text,
                @param3 = 13234;
        END
        ELSE
            EXEC sp_MSreplraiserror @errorid = 20598;
    END
END
GO


ALTER PROCEDURE [dbo].[sp_MSins_WarehouseStockItemHoldings]
    @c1 int,
    @c2 int,
    @c3 nvarchar(20),
    @c4 int,
    @c5 decimal(18,2),
    @c6 int,
    @c7 int,
    @c8 int,
    @c9 datetime2
AS
BEGIN  
    IF NOT EXISTS (SELECT 1 FROM Warehouse.StockItemHoldings WHERE StockItemID = @c1)
    BEGIN
        INSERT INTO Warehouse.StockItemHoldings (
            StockItemID, QuantityOnHand, BinLocation,
            LastStocktakeQuantity, LastCostPrice, ReorderLevel,
            TargetStockLevel, LastEditedBy, LastEditedWhen
        )
        VALUES (
            @c1, @c2, @c3, @c4, @c5, @c6,
            @c7, @c8, @c9
        );
    END
    ELSE
    BEGIN
        RETURN; -- no reinserta, no hace loop
    END
END
GO



ALTER PROCEDURE [dbo].[sp_MSupd_WarehouseStockItemHoldings]
    @c1 int = NULL,
    @c2 int = NULL,
    @c3 nvarchar(20) = NULL,
    @c4 int = NULL,
    @c5 decimal(18,2) = NULL,
    @c6 int = NULL,
    @c7 int = NULL,
    @c8 int = NULL,
    @c9 datetime2 = NULL,
    @pkc1 int = NULL,
    @bitmap binary(2)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Warehouse.StockItemHoldings WHERE StockItemID = @pkc1)
    BEGIN
        RETURN; -- Evita conflicto si llega update antes del insert
    END

    UPDATE Warehouse.StockItemHoldings
    SET
        QuantityOnHand = CASE WHEN SUBSTRING(@bitmap,1,1) & 2  = 2 THEN @c2 ELSE QuantityOnHand END,
        BinLocation    = CASE WHEN SUBSTRING(@bitmap,1,1) & 4  = 4 THEN @c3 ELSE BinLocation END,
        LastStocktakeQuantity = CASE WHEN SUBSTRING(@bitmap,1,1) & 8  = 8 THEN @c4 ELSE LastStocktakeQuantity END,
        LastCostPrice  = CASE WHEN SUBSTRING(@bitmap,1,1) & 16 = 16 THEN @c5 ELSE LastCostPrice END,
        ReorderLevel   = CASE WHEN SUBSTRING(@bitmap,1,1) & 32 = 32 THEN @c6 ELSE ReorderLevel END,
        TargetStockLevel = CASE WHEN SUBSTRING(@bitmap,1,1) & 64 = 64 THEN @c7 ELSE TargetStockLevel END,
        LastEditedBy   = CASE WHEN SUBSTRING(@bitmap,1,1) & 128 = 128 THEN @c8 ELSE LastEditedBy END,
        LastEditedWhen = CASE WHEN SUBSTRING(@bitmap,2,1) & 1 = 1 THEN @c9 ELSE LastEditedWhen END
    WHERE StockItemID = @pkc1;
END
GO




-- 10. crear distribuidor de sj

USE [master];

DECLARE @distributor SYSNAME;
SELECT @distributor = @@SERVERNAME;

EXEC sp_adddistributor 
	@distributor = @distributor, 
	@password = N'Admin1234*'; -- SU CONTRASE�A SA
GO
EXEC sp_adddistributiondb 
	@database = N'distribution', 
	@data_folder = N'/var/opt/mssql/Data', 
	@log_folder = N'/var/opt/mssql/Data', 
	@log_file_size = 2, 
	@min_distretention = 0, 
	@max_distretention = 72, 
	@history_retention = 48, 
	@deletebatchsize_xact = 5000, 
	@deletebatchsize_cmd = 2000, 
	@security_mode = 1
;
GO


USE [distribution];

IF (NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'UIProperties' AND type = 'U ')) 
	CREATE TABLE UIProperties(id INT) 
IF (EXISTS (SELECT * FROM ::fn_listextendedproperty('SnapshotFolder', 'user', 'dbo', 'table', 'UIProperties', NULL, NULL))) 
	EXEC sp_updateextendedproperty N'SnapshotFolder', N'/var/opt/mssql/ReplData', 'user', dbo, 'table', 'UIProperties';
ELSE 
	EXEC sp_addextendedproperty N'SnapshotFolder', N'/var/opt/mssql/ReplData', 'user', dbo, 'table', 'UIProperties';
GO

DECLARE @publisher AS SYSNAME;
DECLARE @distributorlogin AS SYSNAME;
DECLARE @distributorpassword AS SYSNAME;
DECLARE @Server SYSNAME;
 
SELECT @Server = @@servername;
 
SET @publisher = @Server; 
SET @distributorlogin = N'sa'; -- Usuario SA
SET @distributorpassword = N'Admin1234*'; -- SU CONTRASE�A SA

EXEC sp_adddistpublisher 
	@publisher = @publisher, 
	@distribution_db = N'distribution', 
	@security_mode = 0, 
	@login = @distributorlogin, 
	@password = @distributorpassword, 
	@working_directory = N'/var/opt/mssql/ReplData', 
	@trusted = N'false', 
	@thirdparty_flag = 0, 
	@publisher_type = N'MSSQLSERVER'
;
GO

RECONFIGURE;


-- 11. Crear publicacion de bd


-- 12. CREAR SUSCERIPTOR Corporativo

USE [WideWorldImporters];

DECLARE @subscriber AS SYSNAME
DECLARE @subscriber_db AS SYSNAME
DECLARE @subscriberLogin AS SYSNAME
DECLARE @subscriberPassword AS SYSNAME
 
SET @subscriber = N'Corp' -- NOMBRE DEL CONTENEDOR DOCKER
SET @subscriber_db = N'WideWorldImporters' -- NOMBRE DE LA BASE DE DATOS SUBSCRIPTORA
SET @subscriberLogin = N'sa' -- Usuario SA
SET @subscriberPassword = N'Admin1234*' -- SU CONTRASE�A SA

USE [WideWorldImporters];
EXEC sp_addsubscription 
	@publication = N'Replicacion', -- NOMBRE DE LA PUBLICACION
	@subscriber = @subscriber, 
	@destination_db = @subscriber_db, 
	@subscription_type = N'Push',
	@sync_type = N'replication support only',
	@article = N'all', @update_mode = N'read only',
	@subscriber_type = 0
;

EXEC sp_addpushsubscription_agent 
	@publication = N'Replicacion', -- NOMBRE DE LA PUBLICACION
	@subscriber = @subscriber,
	@subscriber_security_mode = 0,
	@subscriber_db = @subscriber_db,
	@subscriber_login = @subscriberLogin,
    @subscriber_password = @subscriberPassword,
	@job_login = NULL, 
	@job_password = NULL, 
	@frequency_type = 64, 
	@frequency_interval = 0,
	@frequency_relative_interval = 0,
	@frequency_recurrence_factor = 0, 
	@frequency_subday = 0, 
	@frequency_subday_interval = 0,
	@active_start_time_of_day = 0,
	@active_end_time_of_day = 235959, 
	@active_start_date = 20241023,
	@active_end_date = 99991231,
	@enabled_for_syncmgr = N'False',
	@dts_package_location = N'Distributor'
;
GO


-- 13. ir a server corporativo y ejecutar las modificaciones de la tabla (paso 14)

-- 15. ir a server limon y continuar




SELECT * FROM Warehouse.StockItemHoldings

UPDATE Warehouse.StockItemHoldings
SET QuantityOnHand = 175626
WHERE StockItemID = 1