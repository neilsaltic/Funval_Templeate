import { pool } from "../config/db.js";
import type { Request, Response } from "express";
import { Router } from "express";

export const ProductosRouter: Router = Router();

export async function getProducts(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM producto");
    res.json({
      message: "conexion exitosa",
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.log("error al consultar en postgres");
    res
      .status(500)
      .json({ message: "error al conectar con la base de datos " });
  }
}

export default ProductosRouter;
