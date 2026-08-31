import { pool } from "../config/db.js";
import z from "zod";
import type { updatePedidoSchema } from "../schemas/pedido.schema.js";

export interface Pedido {
  id: number;
  id_producto: number;
  id_cliente: number;
  fecha: Date;
  cliente_nombre?: string; // para el INNER JOIN
}

export type CreatePedidoInput = Omit<Pedido, "id">;
export type UpdatePedidoInput = z.infer<typeof updatePedidoSchema>;

export const PedidoModel = {
  getAll: async (): Promise<Pedido[]> => {
    const { rows } = await pool.query(`
    SELECT 
      p.*,
      c.nombre AS cliente_nombre
    FROM pedido p
    INNER JOIN cliente c 
      ON p.id_cliente = c.id
    ORDER BY p.id ASC;
  `);
    return rows;
  },

  getById: async (id: number): Promise<Pedido | null> => {
    const { rows } = await pool.query(
      `
    SELECT 
      p.*,
      c.nombre AS cliente_nombre
    FROM pedido p
    INNER JOIN cliente c 
      ON p.id_cliente = c.id
    WHERE p.id = $1;
  `,
      [id],
    );
    return rows[0] || null;
  },

  create: async (dato: CreatePedidoInput): Promise<Pedido> => {
    const { id_producto, id_cliente, fecha } = dato;
    const query = `
      INSERT INTO pedido (id_producto, id_cliente, fecha)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_producto, id_cliente, fecha]);
    return rows[0];
  },

  update: async (
    id: number,
    dato: UpdatePedidoInput,
  ): Promise<Pedido | null> => {
    const campos: string[] = [];
    const valores: any[] = [];
    let indice = 1;

    if (dato.id_producto !== undefined) {
      campos.push(`id_producto = $${indice}`);
      valores.push(dato.id_producto);
      indice++;
    }
    if (dato.id_cliente !== undefined) {
      campos.push(`id_cliente = $${indice}`);
      valores.push(dato.id_cliente);
      indice++;
    }
    if (dato.fecha !== undefined) {
      campos.push(`fecha = $${indice}`);
      valores.push(dato.fecha);
      indice++;
    }

    if (campos.length === 0) {
      throw new Error("Debes enviar al menos un dato para actualizar");
    }

    valores.push(id);
    const consulta = `
      UPDATE pedido
      SET ${campos.join(", ")}
      WHERE id = $${indice}
      RETURNING *;
    `;
    const { rows } = await pool.query(consulta, valores);
    return rows[0] || null;
  },

  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query("DELETE FROM pedido WHERE id = $1;", [
      id,
    ]);
    return (rowCount ?? 0) > 0;
  },
};
