import type { Request, Response } from "express";
import { ProductModel } from "../model/product.model.js";
import { productService } from "../services/product.services.js";

export async function getProducts(req: Request, res: Response) {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Ver todos los Productos'
  try {
    const result = await productService.getProductFilter(req.query);
    res.json(result);
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos",
    });
  }
}

export async function getProductsById(req: Request, res: Response) {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Ver todos los Productos por ID'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el id debe ser numerico" });
      return;
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      res.status(400).json({ error: "producto no encotnrado" });
      return;
    }
    res.json({ data: product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postProduct(req: Request, res: Response) {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Crear un nuevo Producto'
  try {
    const { nombre, descripcion, precio } = req.body;
    const newProduct = await ProductModel.create({
      nombre,
      descripcion,
      precio,
    });
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putProduct(req: Request, res: Response) {
  /*
    #swagger.tags = ['Productos']
    #swagger.summary = 'actualizar un producto existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del Producto',
      required: true,
      schema: {
        nombre: "Pan",
        descripcion:"xxxxxxxxx",
        precio: 100
      }
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const productoUpdate = await ProductModel.update(id, req.body);
    if (!productoUpdate) {
      res.status(404).json({ error: "producto no encontrado" });
      return;
    }
    res.json({ data: productoUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
export async function deleteProducts(req: Request, res: Response) {
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'Eliminar un producto'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const productEliminado = await ProductModel.delete(id);
    if (productEliminado) {
      res.status(200).json({ message: "producto eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "producto no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
