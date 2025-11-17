import React from "react";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/overrides.css";
import "../styles/components.css";

export default function MainContentProyecto2() {
  return (
    <main className="content compact-main">
      <div className="Sup-contenedor compact-container">
        <div className="crumb compact-crumb">
          <button className="chip chip-sm">Bases de Datos 2</button>
          <button className="chip chip-sm2">Proyecto 2</button>
        </div>
        <header className="hero ">
          <h1 className="hero__title">Wide World Importers – Sistema Distribuido</h1>
          <p className="hero__subtitle">
            Corporativo + Sucursales · Replicación · Fragmentación · Usuarios · Estadísticas
          </p>
          <div className="badges badges-sm">
            <span className="badge b-sm">SQL Server</span>
            <span className="badge b-sm">React</span>
            <span className="badge b-sm">REST API</span>
            <span className="badge b-sm">Distribuido</span>
          </div>
        </header>
        <section className="section section-tight">
          <h2 className="section__title title-sm">Componentes del Sistema</h2>
          <div className="modules-grid grid-4-2">
            <article className="card card-sm">
              <span className="icon-pill sm-icon">🏬</span>
              <h3 className="card__title sm-card-title">Sucursales</h3>
              <p className="card__desc sm-desc">
                San José y Limón con inventario y facturación independiente.
              </p>
            </article>
            <article className="card card-sm">
              <span className="icon-pill sm-icon">🏢</span>
              <h3 className="card__title sm-card-title">Corporativo</h3>
              <p className="card__desc sm-desc">
                Consolida estadísticas y almacena datos sensibles de clientes.
              </p>
            </article>
            <article className="card card-sm">
              <span className="icon-pill sm-icon">🔁</span>
              <h3 className="card__title sm-card-title">Replicación</h3>
              <p className="card__desc sm-desc">
                Productos, clientes y proveedores se sincronizan entre las BD.
              </p>
            </article>
            <article className="card card-sm">
              <span className="icon-pill sm-icon">🧩</span>
              <h3 className="card__title sm-card-title">Fragmentación</h3>
              <p className="card__desc sm-desc">
                Fragmentación horizontal y vertical según privacidad y consulta.
              </p>
            </article>

            <article className="card card-sm">
              <span className="icon-pill sm-icon">📊</span>
              <h3 className="card__title sm-card-title">Estadísticas</h3>
              <p className="card__desc sm-desc">
                Filtro por sucursal o consolidado desde corporativo.
              </p>
            </article>

            <article className="card card-sm">
              <span className="icon-pill sm-icon">🔒</span>
              <h3 className="card__title sm-card-title">Usuarios</h3>
              <p className="card__desc sm-desc">
                Contraseñas encriptadas con HASHBYTES.
              </p>
            </article>

          </div>
        </section>
        <footer className="footnote foot-sm">Proyecto 2 - BD II</footer>
      </div>
    </main>
  );
}
