[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TcpR1N0p)
#  Dase de datos distribuida 
---
### Nombre y carné de los integrantes: 
- Brasly Villarebia Morales: 2023105915
- Elder Leon Perez: 2023166120
---
### Estado del proyecto:
Bueno pero incompleto

--- 

## Resultados 

### Bases de Datos (75 puntos)

En esta sección se detallan los resultados obtenidos en cada uno de los rubros de Bases de Datos.  

#### i) Diseño básico de bases de datos (15 pts)

Se diseñaron e implementaron las tres bases de datos requeridas:

- Base **Corporativa**.
- Base de la sucursal **San José**.
- Base de la sucursal **Limón**.

Para cada base de datos se creo un servidor para simulara la coneccion entre sucursales y corporativas.
> **Resultado:** Rubro completado.

---

#### ii) Replicación (20 pts)
se replicaron los modulos de inventario y facturacion, se realizo una seleccion aleatoria de los datos para asignarle datos tanto a la sucursal de San Jose y Limon.

Para ello se utilizaron:
- **Linked Servers** para permitir consultas remotas entre servidores.
- Procedimientos almacenados que replican los cambios de productos (INSERT/UPDATE/DELETE) hacia las demás bases


Las tablas replicadas fueron:

- StockItems
- StockItemStockGroups
- StockItemHoldings
- PurchaseOrderLines
- Suppliers
- SupplierCategories
- Customers
- CustomerCategories
- InvoiceLines
- OrderLines

> **Resultado:** La replicación de los datos necesarios se encuentra implementada y funcional. Rubro completado.

---

#### iii) Fragmentación (20 pts)

Se aplicó fragmentación de la información de acuerdo con el rol de cada base:

- **Fragmentación horizontal por sucursal**  
  Para la fracmentacion Horizontal se altero la tabla de facturas para agregar una columna para dividir las facturas para cada sucursal.

- **Fragmentación vertical / lógica**  
 Para la fragmentación vertical se utilizo la tabla de clientes (Costumers), que se le hizo fragmentación vertical para ocultar los datos sensibles 


> **Resultado:**R ubro completado.

---

#### iv) Vistas materializadas o similar (corporativo) (10 pts)

En la base **corporativa** se implementaron vistas para consolidar información proveniente de las sucursales, con el objetivo de:

- Consultar estadísticas por sucursal.
- Consultar estadísticas consolidadas (San José + Limón).
- Facilitar reportes de ventas y de productos.

> **Resultado:** Rubro completado.

---

#### v) Concurrencia (5 pts)


Los procedimientos almacenados garantizan la concurrencia porque todas las operaciones de inserción, actualización y eliminación se ejecutan bajo el control transaccional de SQL Server. El motor aplica bloqueos automáticos sobre los registros mientras son modificados, evitando conflictos entre usuarios simultáneos y asegurando que los datos se mantengan íntegros y consistentes en todo momento.


> **Resultado:** Rubro completado.

---

#### vi) Encriptación (5 pts)

Se implementó la **encriptación de contraseñas de usuarios** directamente en la base de datos, utilizando las capacidades nativas de SQL Server (por ejemplo, `HASHBYTES` con un algoritmo moderno como SHA2_256).

Para garantizar la seguridad, se utiliza un procedimiento almacenado que recibe el correo electrónico y la contraseña. La comparación de la contraseña se realiza encriptando la contraseña ingresada y comparándola con la contraseña encriptada almacenada en la base de datos. Esto se implementa para no vulnerar la seguridad ni comprometer la confidencialidad de las contraseñas.

> **Resultado:** Encriptación de credenciales implementada según lo solicitado. Rubro completado.
---

### 1) Sistema Web (15 puntos)

#### i) Funcionalidad (10 pts)

La aplicación web está **completamente funcional** en las partes principales requeridas:

- El **login** funciona adecuadamente.
- Se implementó la **validación por roles**:
  - El rol **Administrador** solo puede acceder a los módulos de su sucursal.
  - El rol **Corporativo** puede visualizar las estadísticas globales y opciones administrativas.
- Las pantallas permiten navegar correctamente y muestran la información conectada a la API.
- Las restricciones de acceso funcionan correctamente, bloqueando o escondiendo funciones según el rol del usuario.

> **Resultado:** Rubro completado. El sistema web cumple con la funcionalidad solicitada.

---

#### ii) Diseño de IU y Usabilidad (5 pts)

El diseño de la interfaz presenta:

- Una distribución clara y ordenada para todas las pantallas.
- Botones, formularios y tablas con estilos consistentes.
- Elementos de navegación intuitivos para el usuario.
- Sección de login, menús y componentes bien organizados.
- Buen contraste y legibilidad de textos.

El sistema es fácil de usar, responde correctamente a las acciones del usuario y mantiene coherencia visual en todo el flujo.

> **Resultado:** Rubro completado. Diseño adecuado y usabilidad lograda.

---

### 2) API

La API está **incompleta**.

**Aspectos logrados:**
- El login se realiza correctamente contra la base de datos.
- La API permite validar el rol del usuario (Administrador o Corporativo).
- Existen endpoints funcionales para algunas operaciones principales.

**Aspectos pendientes o incompletos:**
- Algunos endpoints necesarios para cubrir todas las funciones del proyecto no se completaron.
- Falta implementar varias rutas relacionadas con catálogos, inventario o replicación completa.
- No todas las operaciones CRUD están conectadas al 100%.

> **Resultado:** Rubro incompleto.  
La API cumple funciones básicas (autenticación y roles), pero no se completaron todos los endpoints necesarios para cubrir el alcance total del proyecto.
