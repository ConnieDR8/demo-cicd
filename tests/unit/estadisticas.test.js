import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { crearApp } from "../../api/app.js";

describe("GET /api/estadisticas", () => {
  it("devuelve el total almacenado en PostgreSQL", async () => {
    const pool = {
      query: vi.fn().mockResolvedValue({
        rows: [{ total: 15 }],
      }),
    };

    const respuesta = await request(crearApp({ pool }))
      .get("/api/estadisticas");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ total: 15 });

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT COUNT(*)::int AS total FROM mensajes"
    );
  });
});
