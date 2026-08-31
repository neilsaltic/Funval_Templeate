import type { Request, Response } from "express";
import { PedidoModel } from "../model/pedido.model.js";

export async function getAllPedidos(req: Request, res: Response) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'Ver todos los Pedidos'
  try {
    const pedidos = await PedidoModel.getAll();
    res.json({ totalPedidos: pedidos.length, data: pedidos });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos",
    });
  }
}

export async function getPedidoById(req: Request, res: Response) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'Ver un Pedido por su ID'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser numérico" });
    }
    const pedido = await PedidoModel.getById(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json({ data: pedido });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postPedido(req: Request, res: Response) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'Crear un nuevo Pedido'
  /*
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del nuevo Pedido',
      required: true,
      schema: {
        id_producto: 1,
        id_cliente: 2,
        fecha: "2026-08-30"
      }
    }
  */
  try {
    const { id_producto, id_cliente, fecha } = req.body;
    const nuevoPedido = await PedidoModel.create({
      id_producto,
      id_cliente,
      fecha,
    });
    res.status(201).json({ data: nuevoPedido });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function putPedido(req: Request, res: Response) {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.summary = 'Actualizar un Pedido existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del Pedido a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del Pedido',
      required: true,
      schema: {
        id_producto: 3,
        id_cliente: 5,
        fecha: "2026-09-01"
      }
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El ID debe ser un número" });
    }
    const pedidoActualizado = await PedidoModel.update(id, req.body);
    if (!pedidoActualizado) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json({ data: pedidoActualizado });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePedido(req: Request, res: Response) {
  // #swagger.tags = ['Pedidos']
  // #swagger.summary = 'Eliminar un Pedido'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const eliminado = await PedidoModel.delete(id);
    if (eliminado) {
      res.status(200).json({ message: "Pedido eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
