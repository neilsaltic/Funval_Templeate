import { create } from "node:domain";
import z from "zod";
import { pool } from "../config/db.js";
import type { createProductoSchema } from "../schemas/productos.schema.js";

//TIPADO DE LA TABLA
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}
export interface paginaResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
//del tipado otros tipos
export type CreateProductoInput = Omit<Producto, "id">;
export type UpdateProductoInput = z.infer<typeof createProductoSchema>;

//Funciones que consultan a la base de datos

export const ProductModel = {
  findAll: async (): Promise<Producto[]> => {
    const { rows } = await pool.query(
      "SELECT * FROM producto ORDER BY id ASC;",
    );
    return rows;
  },
  findById: async (id: number): Promise<Producto | null> => {
    const { rows } = await pool.query("SELECT * FROM producto WHERE id = $1;", [
      id,
    ]);
    return rows[0] || null;
  },
  create: async (dato: CreateProductoInput): Promise<Producto> => {
    const { nombre, descripcion, precio } = dato;
    const query =
      "INSERT INTO producto (nombre, descripcion, precio) VALUES ($1,$2,$3) RETURNING *;";
    const { rows } = await pool.query(query, [nombre, descripcion, precio]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdateProductoInput,
  ): Promise<Producto | null> => {
    const campos = Object.keys(dato) as (keyof UpdateProductoInput)[];

    const setClause = campos
      .map((campo, i) => `${campo} = $${i + 1}`)
      .join(", ");
    const valores = campos.map((campo) => dato[campo]);

    const { rows } = await pool.query(
      `UPDATE producto
            SET ${setClause}
            WHERE id = $${campos.length + 1}
            RETURNING *;
`,
      [...valores, id],
    );
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM producto WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
  findByName: async (name: string): Promise<Producto | null> => {
    const { rows } = await pool.query<Producto>(
      "SELECT * FROM producto WHERE LOWER(nombre) = LOWER($1);",
      [name],
    );
    return rows[0] || null;
  },
  findWithFilter: async (
    page: number = 1,
    limit: number = 10,
    maxPrice?: number,
  ): Promise<paginaResult<Producto>> => {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1; //Contador de parámetros

    //FILTRO DE PRECIO CORREGIDO
    if (maxPrice !== undefined) {
      conditions.push(`precio <= $${paramIndex}`); //$1, $2... NO el valor directo
      values.push(maxPrice);
      paramIndex++; // ✅ Incrementamos
    }

    // UNIR CONDICIONES
    const whereUnited =
      conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    //CONTAR TOTAL
    const countQuery = `SELECT COUNT(*) AS total FROM producto ${whereUnited}`;
    const countResult = await pool.query(countQuery, values);
    const total = Number(countResult.rows[0].total);

    //OFFSET CORRECTO
    const offset = (page - 1) * limit;

    //AGREGAR LIMIT Y OFFSET al final
    const dataValues = [...values, limit, offset];
    const query = `
    SELECT * FROM producto
    ${whereUnited}
    ORDER BY id ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

    const { rows } = await pool.query(query, dataValues);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
};
