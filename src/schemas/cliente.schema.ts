import z from "zod";

export const createCustomerSchema = z.object({
  nombre: z
    .string({ message: "El Nombre es Obligatorio y debe ser Letras" })
    .trim()
    .min(3, "el Nombre debe de ser minimo de 3 caracteres"),
  email: z.email({ message: "El email no es valido" }).trim(),
  telefono: z
    .string()
    .trim()
    .regex(/^\+[0-9\s-]+$/, {
      message:
        "El teléfono debe empezar con + y contener solo números, espacios y guiones",
    })
    .max(18),
});

export const updateCustomerSchema = createCustomerSchema.partial();
