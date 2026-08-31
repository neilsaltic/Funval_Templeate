import { ProductModel } from "../model/product.model.js";
import type { productoQueryParams } from "../schemas/productos.schema.js";
import type { paginaResult, Producto } from "../model/product.model.js";

export const productService = {
  createProduct: async function (
    nombre: string,
    descripcion: string,
    precio: number,
  ): Promise<Producto> {
    // limpiar espacios vacios al final e inicio del nombre apellidos y telefono
    const cleanName = nombre.trim();
    const cleanlastname = descripcion.trim();

    //evitar q existan 2 productos q tengan el mismo nombre
    const productExist = await ProductModel.findByName(nombre);
    if (productExist) {
      throw new Error("El producto ya existe");
    }
    return await ProductModel.create({
      nombre,
      descripcion,
      precio,
    });
  },
  getProductFilter: async (
    query: productoQueryParams,
  ): Promise<paginaResult<Producto>> => {
    let page = 1;
    let limit = 10;
    if (query.page) {
      page = Number(query.page);
    }
    if (query.limit) {
      limit = Number(query.limit);
    }
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    return await ProductModel.findWithFilter(page, limit, maxPrice);
  },
};
