import { ro } from "zod/locales";
import { pool } from "../config/db.js";

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export type CreateClienteInput = Omit<Cliente, "id">;
export type UpdateClienteInput = {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
};

export const ClientesModel = {
  getAllCustomers: async (): Promise<Cliente[]> => {
    const { rows } = await pool.query("SELECT * FROM cliente ORDER BY id ASC");
    return rows;
  },
  getById: async (id: number): Promise<Cliente | null> => {
    const { rows } = await pool.query("SELECT * FROM cliente WHERE id = $1;", [
      id,
    ]);
    return rows[0] || null;
  },
  create: async (dato: CreateClienteInput): Promise<Cliente> => {
    const { nombre, email, telefono } = dato;
    const query =
      "INSERT INTO cliente (nombre, email, telefono) VALUES ($1,$2,$3) RETURNING *;";
    const { rows } = await pool.query(query, [nombre, email, telefono]);
    return rows[0];
  },
  update: async (
    id: number,
    dato: UpdateClienteInput,
  ): Promise<Cliente | null> => {
    //ir armando la consulta DINÁMICAMENTE
    const campos: string[] = [];
    const valores: any[] = [];
    let indice = 1;

    //Solo agrega el campo si VIENE en el dato
    if (dato.nombre !== undefined) {
      campos.push(`nombre = $${indice}`);
      valores.push(dato.nombre);
      indice++;
    }
    if (dato.email !== undefined) {
      campos.push(`email = $${indice}`);
      valores.push(dato.email);
      indice++;
    }
    if (dato.telefono !== undefined) {
      campos.push(`telefono = $${indice}`);
      valores.push(dato.telefono);
      indice++;
    }

    //Si NO envió NINGÚN campo
    if (campos.length === 0) {
      throw new Error("Debes enviar al menos un dato para actualizar");
    }

    //Agregamos el ID al final
    valores.push(id);

    //Armado de la consulta final
    const consulta = `
    UPDATE cliente
    SET ${campos.join(", ")}
    WHERE id = $${indice}
    RETURNING *;
  `;

    const { rows } = await pool.query(consulta, valores);
    return rows[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
      "DELETE FROM cliente WHERE id = $1;",
      [id],
    );
    return (rowCount ?? 0) > 0;
  },
};
