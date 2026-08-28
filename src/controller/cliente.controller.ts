import type { Request, Response } from "express";
import { ClientesModel } from "../model/cliente.model.js";

export async function getAllCustomer(req: Request, res: Response) {
  // #swagger.tags = ['Clientes']
  // #swagger.summary = 'Ver a todos los Clientes'
  try {
    const customer = await ClientesModel.getAllCustomers();
    res.json({ totalClientes: customer.length, data: customer });
  } catch (error) {
    console.error("error al consultar PostgreSQL: ");
    res.status(500).json({
      message: "error al intentar conectar a la base de datos",
    });
  }
}

export async function getAllCustomersbyID(req: Request, res: Response) {
  // #swagger.tags = ['Clientes']
  // #swagger.summary = 'Ver a a un Cliente por su ID'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "el Id debe ser numerico" });
      return;
    }
    const customer = await ClientesModel.getById(id);
    if (!customer) {
      res.status(400).json({ error: "Cliente no encotnrado" });
      return;
    }
    res.json({ data: customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function postCustomer(req: Request, res: Response) {
  // #swagger.tags = ['Clientes']
  // #swagger.summary = 'Crear un nuevo Cliente'
  try {
    const { nombre, email, telefono } = req.body;
    const newProduct = await ClientesModel.create({
      nombre,
      email,
      telefono,
    });
    res.status(201).json({ data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
export async function putCustomer(req: Request, res: Response) {
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'actualizar un cliente existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del cliente a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del Producto',
      required: true,
      schema: {
        nombre: "Pedro",
        email: "pedro@example.com",
        telefono : "+591 78963254"
      }
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "El id debe ser un Numero" });
    }

    const clienteUpdate = await ClientesModel.update(id, req.body);

    if (!clienteUpdate) {
      return res.status(404).json({ error: "cliente no encontrado" });
    }

    res.json({ data: clienteUpdate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  // #swagger.tags = ['Clientes']
  // #swagger.summary = 'Eliminar un Cliente'
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "EL ID DEBE SER UN VALOR NUMERICO" });
    }
    const productEliminado = await ClientesModel.delete(id);
    if (productEliminado) {
      res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
