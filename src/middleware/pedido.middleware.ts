import type { Request, Response, NextFunction } from "express";
import {
  createPedidoSchema,
  updatePedidoSchema,
} from "../schemas/pedido.schema.js";

export function postValidatePedido(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = createPedidoSchema.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensaje: err.message,
    }));
    return res
      .status(400)
      .json({ error: "Datos no válidos", detalles: errores });
  }
  next();
}

export function updateValidatePedido(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = updatePedidoSchema.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensaje: err.message,
    }));
    return res
      .status(400)
      .json({ error: "Datos no válidos", detalles: errores });
  }
  next();
}
