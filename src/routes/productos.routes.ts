import { Router } from "express";
import {
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

export default ProductosRouter;
