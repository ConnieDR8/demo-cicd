import { describe, it, expect } from "vitest";

const BASE = (
  process.env.APP_URL || "http://localhost:8080"
).replace(/\/$/, "");

describe("Estadisticas integradas con PostgreSQL", () => {
  it("incrementa el total al guardar un mensaje", async () => {
    const anterior = await fetch(`${BASE}/api/estadisticas`);
    expect(anterior.status).toBe(200);

    const { total: antes } = await anterior.json();
    expect(Number.isInteger(antes)).toBe(true);

    const creado = await fetch(`${BASE}/api/mensajes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Pipeline",
        mensaje: `Estadisticas ${Date.now()}`,
      }),
    });

    expect(creado.status).toBe(201);

    const posterior = await fetch(`${BASE}/api/estadisticas`);
    expect(posterior.status).toBe(200);

    const { total: despues } = await posterior.json();

    expect(despues).toBeGreaterThanOrEqual(antes + 1);
  });
});
