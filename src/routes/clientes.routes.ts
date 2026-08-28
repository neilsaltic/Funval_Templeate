import { Router } from "express";
import {
  deleteCustomer,
  getAllCustomer,
  getAllCustomersbyID,
  postCustomer,
  putCustomer,
} from "../controller/cliente.controller.js";
import {
  postValidateCustomer,
  updateValidateCustomer,
} from "../middleware/cliente.middleware.js";

export const CustomerRouter: Router = Router();

CustomerRouter.get("/", getAllCustomer);
CustomerRouter.get("/:id", getAllCustomersbyID);
CustomerRouter.post("/", postValidateCustomer, postCustomer);
CustomerRouter.put("/:id", updateValidateCustomer, putCustomer);
CustomerRouter.delete("/:id", deleteCustomer);

export default CustomerRouter;
