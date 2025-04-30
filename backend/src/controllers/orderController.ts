import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export const service = new OrderService();

export async function createOrder(req: Request, res: Response) {
  try {
    const { user_uuid } = req.params;
    const order = await service.createOrder(user_uuid, req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const order = await service.getOrderById(orderId);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export async function updateOrder(req: Request, res: Response) {
  try {
    const { user_uuid } = req.params;
    const updated = await service.updateOrder(user_uuid, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { user_uuid } = req.params;
    const result = await service.deleteOrder(user_uuid);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getOrdersByUser(req: Request, res: Response) {
  try {
    const user_uuid = req.params.user_uuid || (req.query.user_uuid as string);
    const orders = await service.getOrdersByUser(user_uuid);
    res.json(orders);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
