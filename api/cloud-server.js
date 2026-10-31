import express from "express";
import pg from "pg";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crearApp } from "./app.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL es obligatoria");
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  max: 5,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (error) => {
  console.error("Error de PostgreSQL:", error.message);
});

// Inicializa el esquema de una base nueva sin borrar datos.
await pool.query(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    mensaje VARCHAR(280) NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

const app = crearApp({
  pool,
  exponerMetricas: false,
});

const directorio = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(directorio, "public")));

const puerto = Number(process.env.PORT || 10000);

const server = app.listen(puerto, "0.0.0.0", () => {
  console.log(`R5 Cloud escuchando en puerto ${puerto}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      pool.end().finally(() => process.exit(0));
    });
  });
}
