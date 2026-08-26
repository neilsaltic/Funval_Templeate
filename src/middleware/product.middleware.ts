import type { Request, Response, NextFunction } from "express";
import { createProductoSchema } from "../schemas/productos.schema.js";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = createProductoSchema.safeParse(req.body);

  if (!resultado.success) {
    const errores = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      message: err.message,
    }));
    return res
      .status(400)
      .json({ error: "datos no validos", detalles: errores });
  }
  next();
}
