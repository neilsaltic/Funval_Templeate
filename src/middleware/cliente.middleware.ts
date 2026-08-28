import type { Request, Response, NextFunction } from "express";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/cliente.schema.js";

//Validación para CREAR cliente
export function postValidateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = createCustomerSchema.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensaje: err.message, //
    }));
    return res
      .status(400)
      .json({ error: "Datos no válidos", detalles: errores });
  }
  next();
}

//Validación para ACTUALIZAR cliente
export function updateValidateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = updateCustomerSchema.safeParse(req.body);
  if (!resultado.success) {
    const errores = resultado.error.issues.map((err) => ({
      campo: err.path.join("."),
      mensaje: err.message, //
    }));
    return res
      .status(400)
      .json({ error: "Datos no válidos", detalles: errores });
  }
  next();
}
