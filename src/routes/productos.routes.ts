import { Router } from "express";
import {
  deleteProducts,
  getProducts,
  getProductsById,
  postProduct,
  putProduct,
} from "../controller/product.controller.js";

export const ProductosRouter: Router = Router();

ProductosRouter.get("/", getProducts);
ProductosRouter.get("/:id", getProductsById);
ProductosRouter.post("/", postProduct);
ProductosRouter.put("/:id", putProduct);
ProductosRouter.delete("/:id", deleteProducts);

export default ProductosRouter;
