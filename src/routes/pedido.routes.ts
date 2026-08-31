import { Router } from "express";
import {
  getAllPedidos,
  getPedidoById,
  postPedido,
  putPedido,
  deletePedido,
} from "../controller/pedido.controller.js";
import {
  postValidatePedido,
  updateValidatePedido,
} from "../middleware/pedido.middleware.js";

const pedidosrouter: Router = Router();

// ✅ Rutas como pide la tarea → /api/pedido
pedidosrouter.get("/", getAllPedidos);
pedidosrouter.get("/:id", getPedidoById);
pedidosrouter.post("/", postValidatePedido, postPedido);
pedidosrouter.put("/:id", updateValidatePedido, putPedido);
pedidosrouter.delete("/:id", deletePedido);

export default pedidosrouter;
