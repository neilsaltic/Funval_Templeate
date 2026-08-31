import { z } from "zod";

export const createPedidoSchema = z.object({
  id_producto: z
    .number({
      message: "El ID del producto es obligatorio y debe ser un numero",
    })
    .int("Debe ser un número entero")
    .positive("El ID del producto debe ser mayor a 0"),

  id_cliente: z
    .number({
      message: "El ID del cliente es obligatorio y debe ser un numero",
    })
    .int("Debe ser un numero entero")
    .positive("El ID del cliente debe ser mayor a 0"),

  fecha: z.coerce
    .date() //
    .default(() => new Date()),
});

export const updatePedidoSchema = createPedidoSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
