import axios from "axios";
import { Order } from "@/types/orderTypes";

const API_URL = "http://localhost:3001/orders";

const TOKEN = localStorage.getItem("token");
const REFRESH_TOKEN = localStorage.getItem("refresh_token");

const authHeaders = {
  headers: {
    authorization: `Bearer ${TOKEN}`,
    "x-refresh-token": REFRESH_TOKEN,
  },
};

export const createOrder = async (
  user_uuid: string,
  orderData: Partial<Order>
): Promise<Order> => {
  try {
    const response = await axios.post(`${API_URL}/${user_uuid}`, orderData, authHeaders);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw new Error("Erro ao criar pedido.");
  }
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  try {
    const response = await axios.get(`${API_URL}/by-id/${orderId}`, authHeaders);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw new Error("Erro ao buscar pedido.");
  }
};

export const updateOrder = async (
  user_uuid: string,
  updatedData: Partial<Order>
): Promise<Order> => {
  try {
    const response = await axios.put(`${API_URL}/${user_uuid}`, updatedData, authHeaders);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    throw new Error("Erro ao atualizar pedido.");
  }
};

export const deleteOrder = async (user_uuid: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_URL}/${user_uuid}`, authHeaders);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    throw new Error("Erro ao deletar pedido.");
  }
};

export const getOrdersByUser = async (user_uuid: string): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${user_uuid}`, authHeaders);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    throw new Error("Erro ao buscar pedidos do usuário.");
  }
};