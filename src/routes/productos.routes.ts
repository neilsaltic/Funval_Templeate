import { Router } from "express";
import {
  deleteProducts,
  getProducts,
  getProductsById,
  postProduct,
  putProduct,
} from "../controller/product.controller.js";
import {
  postValidateProduct,
  updateValidateProduct,
} from "../middleware/product.middleware.js";

export const ProductosRouter: Router = Router();

ProductosRouter.get("/", getProducts);
ProductosRouter.get("/:id", getProductsById);
ProductosRouter.post("/", postProduct);
ProductosRouter.put("/:id", putProduct);
ProductosRouter.delete("/:id", deleteProducts);

export default ProductosRouter;
