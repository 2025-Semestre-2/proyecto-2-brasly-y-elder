import React from "react";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/overrides.css";
import "../styles/components.css";


export default function MainContent() {
  return (
    <main className="content">
      <div className="Sup-contenedor">
        <div className="crumb">
          <button className="chip">Bases de Datos 2</button>
        </div>
        <header className="hero">
          <h1 className="hero__title">Wide World Importers</h1>
          <p className="hero__subtitle">
            Sistema de gestión con módulos de clientes, proveedores, inventarios, ventas y estadísticas
          </p>
          <div className="badges">
            <span className="badge">SQL Server</span>
            <span className="badge">React</span>
            <span className="badge">TypeScript</span>
            <span className="badge">REST API</span>
          </div>
        </header>
        <section className="section">
          <h2 className="section__title">Módulos del Sistema</h2>

          <div className="modules-grid">
            <article className="card">
              <div className="card__icon"><span className="icon-pill">💳</span></div>
              <h3 className="card__title">Clientes</h3>
              <p className="card__desc">Consulta y gestión de clientes</p>
            </article>

            <article className="card">
              <div className="card__icon"><span className="icon-pill">📛</span></div>
              <h3 className="card__title">Proveedores</h3>
              <p className="card__desc">Consulta y gestión de proveedores</p>
            </article>

            <article className="card">
              <div className="card__icon"><span className="icon-pill">📦</span></div>
              <h3 className="card__title">Inventarios</h3>
              <p className="card__desc">Consulta y gestión de inventarios</p>
            </article>

            <article className="card">
              <div className="card__icon"><span className="icon-pill">🧾</span></div>
              <h3 className="card__title">Ventas</h3>
              <p className="card__desc">Consulta y gestión de ventas</p>
            </article>

            <article className="card">
              <div className="card__icon"><span className="icon-pill">📊</span></div>
              <h3 className="card__title">Estadísticas</h3>
              <p className="card__desc">Análisis avanzado de datos</p>
            </article>
          </div>
        </section>
        <section className="info-row">
          <div className="info-card">
            <div className="info-card__left">
              <span className="small-pill">🗄️</span>
              <span className="info-card__title">Base de Datos</span>
            </div>
            <p className="info-card__desc">
              Procedimientos almacenados, ROLLUP, PARTITION, DENSE_RANK
            </p>
          </div>

          <div className="info-card">
            <div className="info-card__left">
              <span className="small-pill">🧩</span>
              <span className="info-card__title">Arquitectura</span>
            </div>
            <p className="info-card__desc">
              Frontend/Backend separados con API REST
            </p>
          </div>
        </section>

        <footer className="footnote">Proyecto 1 - Bases de Datos 2</footer>
      </div>
    </main>
  );
}
