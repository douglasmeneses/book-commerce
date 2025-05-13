import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(user_uuid: string, data: any) {
    try {
      const user = await prisma.user.findUnique({ where: { uuid: user_uuid } });
      if (!user) throw new Error("Usuário não encontrado");

      const cart = await prisma.cart.findFirst({
        where: { user_id: user.id },
        include: { cartItem: true },
      });

      if (!cart || cart.cartItem.length === 0) {
        throw new Error("Carrinho vazio ou inexistente");
      }

      const subtotal = cart.cartItem.reduce(
        (acc, item) => acc + item.price.toNumber() * item.quantity,
        0
      );
      const shipping = 10;
      const total = subtotal + shipping;

      const order = await prisma.order.create({
        data: {
          user_id: user.id,
          cart_id: cart.id,
          address_id: data.address_id,
          payment: data.payment,
          credit_card_user_id: data.credit_card_user_id,
          credit_card_number: data.credit_card_number,
          subtotal,
          shipping,
          total,
          status: "PENDING",
        },
      });

      for (const item of cart.cartItem) {
        await prisma.orderItem.create({
          data: {
            order_id: order.id,
            book_id: item.book_id,
            quantity: item.quantity,
            price: item.price,
            total_price: item.price,
          },
        });
      }
      await prisma.cartItem.deleteMany({
        where: {
          cart_id: cart.id,
        },
      });
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          updated_at: new Date(),
        },
      });

      return order;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Erro ao criar pedido: ${err.message}`);
    }
  }

  async getOrderById(orderId: number) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: { include: { book: true } },
        },
      });
      if (!order) throw new Error("Pedido não encontrado");
      return order;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Erro ao buscar pedido: ${err.message}`);
    }
  }

  async updateOrder(user_uuid: string, data: any) {
    try {
      const user = await prisma.user.findUnique({ where: { uuid: user_uuid } });
      if (!user) throw new Error("Usuário não encontrado");

      const order = await prisma.order.updateMany({
        where: { user_id: user.id },
        data,
      });

      return order;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Erro ao atualizar pedido: ${err.message}`);
    }
  }

  async deleteOrder(user_uuid: string) {
    try {
      const user = await prisma.user.findUnique({ where: { uuid: user_uuid } });
      if (!user) throw new Error("Usuário não encontrado");

      const orders = await prisma.order.findMany({
        where: { user_id: user.id },
        select: { id: true },
      });

      for (const order of orders) {
        await prisma.orderItem.deleteMany({
          where: { order_id: order.id },
        });
      }

      await prisma.order.deleteMany({
        where: { user_id: user.id },
      });

      return { message: "Pedidos deletados com sucesso" };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Erro ao deletar pedidos: ${err.message}`);
    }
  }

  async getOrdersByUser(user_uuid: string) {
    try {
      const user = await prisma.user.findUnique({ where: { uuid: user_uuid } });
      if (!user) throw new Error("Usuário não encontrado");

      const orders = await prisma.order.findMany({
        where: { user_id: user.id },
        include: {
          items: { include: { book: true } as any },
        },
      });

      if (orders.length === 0) {
        return [];
      }

      return orders;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Erro ao buscar pedidos do usuário: ${err.message}`);
    }
  }
}
