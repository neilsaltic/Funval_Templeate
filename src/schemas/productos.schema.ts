import { isNumberObject } from "node:util/types";
import z, { number } from "zod";

export const createProductoSchema = z.object({
  nombre: z
    .string({ message: "El Nombre es Obligatorio" })
    .trim()
    .min(3, "el Nombre debe de ser minimo de 3 caracteres"),
  descripcion: z
    .string({ message: "La Descripcion es obligatoria" })
    .trim()
    .min(3, "minimo debe de ser 3 caracteres"),
  precio: z
    .number({ message: "El precio es Obligatorio" })
    .positive("El precio debe de ser mayor a 0"),
});

export const updateProductSchema = createProductoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export interface productoQueryParams {
  page?: string;
  limit?: string;
  maxPrice?: string;
}
