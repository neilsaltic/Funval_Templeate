import { Router } from "express";
import {
  deleteProducts,
  getProducts,
  getProductsById,
  postProduct,
  putProduct,
} from "../controller/product.controller.js";
import { validateProduct } from "../middleware/product.middleware.js";

export const ProductosRouter: Router = Router();

ProductosRouter.get("/", getProducts);
ProductosRouter.get("/:id", getProductsById);
ProductosRouter.post("/", validateProduct, postProduct);
ProductosRouter.put("/:id", putProduct);
ProductosRouter.delete("/:id", deleteProducts);

export default ProductosRouter;
