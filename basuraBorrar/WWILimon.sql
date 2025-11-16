USE master;
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WWILimon')
BEGIN
    CREATE DATABASE WWILimon;
END
GO

----fragmentacion verticval clientes

USE WideWorldImporters;
GO
--  HORIZONTAL HACIA WWILimon =====
-- 1️Facturas de Limón
SELECT *
INTO WWILimon.dbo.sales_Invoices
FROM sales.Invoices
WHERE Sucursal = N'Limón';
GO

SELECT L.*
INTO WWILimon.dbo.sales_InvoiceLines
FROM sales.InvoiceLines AS L
INNER JOIN sales.Invoices AS I 
    ON L.InvoiceID = I.InvoiceID
WHERE I.Sucursal = N'Limón';
GO
---fragmntacion vertial costumes
SELECT *
INTO WWILimon.dbo.web_users
FROM web.users
WHERE sucursal = N'limon';
GO
 
--toma de los provedores actuales 
SELECT 
  CustomerID, CustomerName, CustomerCategoryID,
  BuyingGroupID, CreditLimit, PaymentDays,
  AccountOpenedDate, StandardDiscountPercentage,
  IsStatementSent, IsOnCreditHold,
  DeliveryMethodID, DeliveryCityID, PostalCityID,
  WebsiteURL, LastEditedBy
INTO WWILimon.dbo.Customers_Operativos   
FROM Sales.Customers;
GO

SELECT * from Purchasing.Suppliers

