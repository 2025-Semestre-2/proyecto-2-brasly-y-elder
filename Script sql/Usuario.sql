

-- Creacion de usario que solo tiene permiso de ejecutar Procedimientos almacenados 


create LOGIN UsuarioPrueba with password = 'py#12025';
go
use WideWorldimporters;
go
create USER UsuarioPrueba FOR login UsuarioPrueba;
go
grant execute to UsuarioPrueba;
go



