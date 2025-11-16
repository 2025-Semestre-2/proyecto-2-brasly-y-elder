USE WideWorldImporters;
GO

/* ===== esquema ===== */
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'web')
    EXEC ('CREATE SCHEMA web AUTHORIZATION dbo;');
GO

/* ===== tabla (drop + create limpio) ===== */
IF OBJECT_ID('web.users','U') IS NOT NULL 
    DROP TABLE web.users;
GO

CREATE TABLE web.users
(
  iduser        INT IDENTITY(1,1) NOT NULL 
                CONSTRAINT pk_web_users PRIMARY KEY,
  username      NVARCHAR(100) NOT NULL,
  password_hash VARBINARY(64) NOT NULL,  
  password_salt VARBINARY(16) NOT NULL,  
  fullname      NVARCHAR(250) NOT NULL,
  active        BIT NOT NULL 
                CONSTRAINT df_web_users_active DEFAULT(1),
  rol           NVARCHAR(20) NOT NULL,    -- 'administrador' | 'corporativo'
  email         NVARCHAR(150) NOT NULL,
  hiredate      DATE NOT NULL 
                CONSTRAINT df_web_users_hiredate DEFAULT(CONVERT(date, GETDATE())),
  sucursal      NVARCHAR(20) NOT NULL,    -- 'san jose' | 'limon' | 'corporativo'
  created_at    DATETIME2(0) NOT NULL 
                CONSTRAINT df_web_users_created DEFAULT(SYSUTCDATETIME())
);
GO


CREATE UNIQUE INDEX ux_web_users_username ON web.users(username);
CREATE UNIQUE INDEX ux_web_users_email    ON web.users(email);
GO

ALTER TABLE web.users
  ADD CONSTRAINT ck_web_users_rol
  CHECK (rol IN (N'administrador', N'corporativo'));

ALTER TABLE web.users
  ADD CONSTRAINT ck_web_users_sucursal
  CHECK (sucursal IN (N'san jose', N'limon', N'corporativo'));
GO
DECLARE @salt VARBINARY(16), @hash VARBINARY(64);


-- roberto (san jose)
SET @salt = CRYPT_GEN_RANDOM(16);
SET @hash = HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(4000), N'1234'));
INSERT INTO web.users (username, password_hash, password_salt, fullname, active, rol, email, sucursal)
VALUES (N'roberto', @hash, @salt, N'roberto su', 1, N'administrador', N'rob@email.com', N'san jose');

-- saul (limon)
SET @salt = CRYPT_GEN_RANDOM(16);
SET @hash = HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(4000), N'1234'));
INSERT INTO web.users (username, password_hash, password_salt, fullname, active, rol, email, sucursal)
VALUES (N'saul', @hash, @salt, N'saul torres', 0, N'administrador', N'saul@email.com', N'limon');

-- rodrigo (san jose)
SET @salt = CRYPT_GEN_RANDOM(16);
SET @hash = HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(4000), N'1234'));
INSERT INTO web.users (username, password_hash, password_salt, fullname, active, rol, email, sucursal)
VALUES (N'rodrigo', @hash, @salt, N'rodrigo salas', 1, N'administrador', N'rod@email.com', N'san jose');

-- corporativo (corporativo)
SET @salt = CRYPT_GEN_RANDOM(16);
SET @hash = HASHBYTES('SHA2_512', @salt + CONVERT(VARBINARY(4000), N'1234'));
INSERT INTO web.users (username, password_hash, password_salt, fullname, active, rol, email, sucursal)
VALUES (N'corp', @hash, @salt, N'corporativo central', 1, N'corporativo', N'corp@email.com', N'corporativo');
GO


----------------Fragmentaciones de informacion facturas por sucursal 

ALTER TABLE sales.Invoices
ADD Sucursal NVARCHAR(20);

UPDATE sales.Invoices
SET Sucursal = CASE 
                   WHEN ABS(CHECKSUM(NEWID())) % 2 = 0 THEN N'San José'
                   ELSE N'Limón'
               END;



