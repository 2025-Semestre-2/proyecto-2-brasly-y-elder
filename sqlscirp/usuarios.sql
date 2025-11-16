use WideWorldImporters;
go

--------------------------------------------------------
-- 1. DROPS DE OBJETOS EXISTENTES
--------------------------------------------------------
if exists (select * from sys.objects where name='validarusuario' and type='P')
    drop procedure validarusuario;
go

if exists (select * from sys.objects where name='insertarusuario' and type='P')
    drop procedure insertarusuario;
go

if exists (select * from sys.objects where name='usuarios' and type='U')
    drop table usuarios;
go

--------------------------------------------------------
-- 2. CREACIÓN DE TABLA USUARIOS CON SUCURSAL
--------------------------------------------------------
create table usuarios (
    iduser int primary key,
    username varchar(50) not null unique,
    password varbinary(64) not null,
    fullname varchar(100) not null,
    active bit not null default 1,
    rol varchar(50) not null,
    email varchar(100) not null unique,
    hiredate date not null default getdate(),
    sucursal varchar(20) not null,
    constraint chk_usuarios_rol check (rol in ('administrador', 'corporativo')),
    constraint chk_usuarios_sucursal check (sucursal in ('San José','Limón','Corporativo'))
);
go

--------------------------------------------------------
-- 3. PROCEDIMIENTO insertarusuario
--------------------------------------------------------
create procedure insertarusuario
    @iduser int,
    @username varchar(50),
    @password varchar(200),
    @fullname varchar(100),
    @rol varchar(50),
    @email varchar(100),
    @sucursal varchar(20),
    @active bit = 1
as
begin
    set nocount on;

    declare @passhash varbinary(64);
    set @passhash = hashbytes('sha2_256', @password);

    insert into usuarios (iduser, username, password, fullname, active, rol, email, sucursal)
    values (@iduser, @username, @passhash, @fullname, @active, @rol, @email, @sucursal);
end;
go

--------------------------------------------------------
-- 4. PROCEDIMIENTO validarusuario
--    Retorna todos los datos del usuario para el TOKEN
--------------------------------------------------------
create procedure validarusuario
    @email varchar(100),
    @password varchar(200)
as
begin
    set nocount on;

    declare @passhash varbinary(64);
    set @passhash = hashbytes('sha2_256', @password);

    select 
        iduser,
        username,
        fullname,
        rol,
        email,
        hiredate,
        active,
        sucursal
    from usuarios
    where email = @email
      and password = @passhash
      and active = 1;
end;
go

--------------------------------------------------------
-- 5. INSERTS DE PRUEBA
--------------------------------------------------------
exec insertarusuario
    @iduser = 119200156,
    @username = 'admin1',
    @password = 'admin123',
    @fullname = 'juan administrador',
    @rol = 'administrador',
    @email = 'admin1@empresa.com',
    @sucursal = 'Corporativo',
    @active = 1;

exec insertarusuario
    @iduser = 119200157,
    @username = 'corp01',
    @password = 'clave2025',
    @fullname = 'ana corporativa',
    @rol = 'corporativo',
    @email = 'ana@empresa.com',
    @sucursal = 'San José',
    @active = 1;

exec insertarusuario
    @iduser = 119200158,
    @username = 'limon01',
    @password = 'limonpass',
    @fullname = 'mario limón',
    @rol = 'corporativo',
    @email = 'mario@empresa.com',
    @sucursal = 'Limón',
    @active = 1;
go

--------------------------------------------------------
-- 6. PRUEBA DE LOGIN
--------------------------------------------------------
exec validarusuario
    @email = 'admin1@empresa.com',
    @password = 'admin123';
go
