import { describe, expect, it } from "vitest";
import { parseCatalogoSpreadsheetFile } from "./catalogo-excel-import";

function csvFile(content: string, name = "catalogo.csv"): File {
  return new File([content], name, { type: "text/csv" });
}

describe("catalogo-excel-import", () => {
  it("parsea filas con SKU y Título", async () => {
    const file = csvFile(
      [
        "SKU,Titulo,Tipo,Proveedor,Precio,Vinculado",
        "SKU-001,Salmon entero,Primario,Mar Azul,12000,",
        "SKU-002,Filete 500g,Secundario,Mar Azul,8000,SKU-001",
      ].join("\n"),
    );

    const result = await parseCatalogoSpreadsheetFile(file);

    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toMatchObject({
      sku: "SKU-001",
      titulo: "Salmon entero",
      tipo: "primario",
    });
    expect(result.rows[1]?.tipo).toBe("secundario");
  });

  it("reporta error si falta SKU", async () => {
    const file = csvFile(["SKU,Titulo", ",Sin SKU"].join("\n"));

    const result = await parseCatalogoSpreadsheetFile(file);

    expect(result.rows).toEqual([]);
    expect(result.errors[0]).toContain("falta SKU");
  });
});
