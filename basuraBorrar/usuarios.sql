create database pruebas
go

use pruebas
go 

create table usuarios (
    iduser int primary key,
    username varchar(50) not null unique,
    password varbinary(64) not null,
    fullname varchar(100) not null,
    active bit not null default 1,
    rol varchar(50) not null,
    email varchar(100) not null unique,
    hiredate date not null default getdate(),
    constraint chk_usuarios_rol check (rol in ('administrador', 'corporativo'))
);
go 


create procedure insertarusuario
    @iduser int,
    @username varchar(50),
    @password varchar(200),
    @fullname varchar(100),
    @rol varchar(50),
    @email varchar(100),
    @active bit = 1
as
begin
    set nocount on;
    declare @passhash varbinary(64);
    set @passhash = hashbytes('sha2_256', @password);
    insert into usuarios (iduser,username, password, fullname, active, rol, email)
    values (@iduser,@username, @passhash, @fullname, @active, @rol, @email);
end;
go 

create procedure validarusuario
    @email varchar(100),
    @password varchar(200)
as
begin
    set nocount on;

    declare @passhash varbinary(64);
    set @passhash = hashbytes('sha2_256', @password);

    select iduser,username, fullname, rol, email, hiredate,active
    from usuarios
    where email = @email
      and password = @passhash
      and active = 1;
end;
go

exec sp_insertarusuario
    @iduser= 119200156,
    @username = 'admin1',
    @password = 'admin123',
    @fullname = 'juan administrador',
    @rol = 'administrador',
    @email = 'admin1@empresa.com',
    @active = 1;

exec sp_insertarusuario
    @iduser= 119200157,
    @username = 'corp01',
    @password = 'clave2025',
    @fullname = 'ana corporativa',
    @rol = 'corporativo',
    @email = 'ana@empresa.com',
    @active = 1;


exec validarusuario
    @email = 'admin1@empresa.com',
    @password = 'admin123';

