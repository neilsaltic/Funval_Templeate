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
ProductosRouter.post("/", postValidateProduct, postProduct);
ProductosRouter.put("/:id", updateValidateProduct, putProduct);
ProductosRouter.delete("/:id", deleteProducts);

export default ProductosRouter;
