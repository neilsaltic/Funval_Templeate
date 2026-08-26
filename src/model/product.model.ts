import { create } from "node:domain";
import { pool } from "../config/db.js";

//TIPADO DE LA TABLA
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}
//del tipado otros tipos
export type CreateProductoInput = Omit<Producto, "id">;
export type UpdateProductoInput = Partial<CreateProductoInput>;

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
    const { rows } = await pool.query(
      `UPDATE producto
            SET nombre = $1,
            descripcion = $2,
            precio = $3
            WHERE id = $4
            RETURNING *;
`,
      [dato.nombre, dato.descripcion, dato.precio, id],
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
};
