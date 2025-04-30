import { PrismaClient } from "@prisma/client";
import { OrderService } from "../orderService";

const orderService = new OrderService();

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    cart: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    orderItem: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("orderService.createOrder", () => {
  it("deve criar um pedido com sucesso", async () => {
    const user_uuid = "test-uuid";
    const data = {
      address_id: 1,
      payment: "credit_card",
      credit_card_user_id: 2,
      credit_card_number: "1234-5678-9012-3456",
    };

    const mockUser = { id: 1, uuid: user_uuid };
    const mockCart = {
      id: 1,
      user_id: mockUser.id,
      cartItem: [
        { book_id: 1, price: { toNumber: () => 20 }, quantity: 2 },
        { book_id: 2, price: { toNumber: () => 15 }, quantity: 1 },
      ],
    };
    const mockOrder = { id: 1, user_id: mockUser.id, status: "PENDING" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);
    (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);
    (prisma.orderItem.create as jest.Mock).mockResolvedValue({});
    (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.cart.update as jest.Mock).mockResolvedValue({});

    const result = await orderService.createOrder(user_uuid, data);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.cart.findFirst).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      include: { cartItem: true },
    });
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        user_id: mockUser.id,
        cart_id: mockCart.id,
        address_id: data.address_id,
        payment: data.payment,
        credit_card_user_id: data.credit_card_user_id,
        credit_card_number: data.credit_card_number,
        subtotal: 55, // (20 * 2) + (15 * 1)
        shipping: 10,
        total: 65,
        status: "PENDING",
      },
    });
    expect(prisma.orderItem.create).toHaveBeenCalledTimes(2);
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cart_id: mockCart.id },
    });
    expect(prisma.cart.update).toHaveBeenCalledWith({
      where: { id: mockCart.id },
      data: { updated_at: expect.any(Date) },
    });
    expect(result).toEqual(mockOrder);
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";
    const data = {};

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(orderService.createOrder(user_uuid, data)).rejects.toThrow(
      "Usuário não encontrado"
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
  });

  it("deve lançar um erro se o carrinho estiver vazio ou não existir", async () => {
    const user_uuid = "test-uuid";
    const data = {};
    const mockUser = { id: 1, uuid: user_uuid };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.cart.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(orderService.createOrder(user_uuid, data)).rejects.toThrow(
      "Carrinho vazio ou inexistente"
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.cart.findFirst).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      include: { cartItem: true },
    });
  });
});
describe("orderService.getOrderById", () => {
  it("deve retornar o pedido quando ele existir", async () => {
    const orderId = 1;
    const mockOrder = {
      id: orderId,
      user_id: 1,
      status: "PENDING",
      items: [
        {
          id: 1,
          book_id: 1,
          quantity: 2,
          price: 20,
          book: { id: 1, title: "Book 1" },
        },
      ],
    };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderService.getOrderById(orderId);

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: orderId },
      include: {
        items: { include: { book: true } },
      },
    });
    expect(result).toEqual(mockOrder);
  });

  it("deve lançar um erro se o pedido não for encontrado", async () => {
    const orderId = 999;

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(orderService.getOrderById(orderId)).rejects.toThrow(
      "Pedido não encontrado"
    );

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: orderId },
      include: {
        items: { include: { book: true } },
      },
    });
  });
});
describe("orderService.updateOrder", () => {
  it("deve atualizar o pedido com sucesso", async () => {
    const user_uuid = "test-uuid";
    const data = { status: "COMPLETED" };

    const mockUser = { id: 1, uuid: user_uuid };
    const mockUpdatedOrder = { count: 1 };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.order.updateMany as jest.Mock).mockResolvedValue(mockUpdatedOrder);

    const result = await orderService.updateOrder(user_uuid, data);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      data,
    });
    expect(result).toEqual(mockUpdatedOrder);
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";
    const data = { status: "COMPLETED" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(orderService.updateOrder(user_uuid, data)).rejects.toThrow(
      "Usuário não encontrado"
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
  });
});
describe("orderService.deleteOrder", () => {
  it("deve deletar os pedidos do usuário com sucesso", async () => {
    const user_uuid = "test-uuid";
    const mockUser = { id: 1, uuid: user_uuid };
    const mockOrders = [{ id: 1 }, { id: 2 }];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
    (prisma.orderItem.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.order.deleteMany as jest.Mock).mockResolvedValue({});

    const result = await orderService.deleteOrder(user_uuid);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      select: { id: true },
    });
    expect(prisma.orderItem.deleteMany).toHaveBeenCalledTimes(
      mockOrders.length
    );
    mockOrders.forEach((order) => {
      expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({
        where: { order_id: order.id },
      });
    });
    expect(prisma.order.deleteMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
    });
    expect(result).toEqual({ message: "Pedidos deletados com sucesso" });
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(orderService.deleteOrder(user_uuid)).rejects.toThrow(
      "Usuário não encontrado"
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
  });

  it("deve retornar sucesso mesmo se o usuário não tiver pedidos", async () => {
    const user_uuid = "test-uuid";
    const mockUser = { id: 1, uuid: user_uuid };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.order.deleteMany as jest.Mock).mockResolvedValue({});

    const result = await orderService.deleteOrder(user_uuid);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      select: { id: true },
    });
    expect(prisma.orderItem.deleteMany).not.toHaveBeenCalled();
    expect(prisma.order.deleteMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
    });
    expect(result).toEqual({ message: "Pedidos deletados com sucesso" });
  });
});
describe("orderService.getOrdersByUser", () => {
  it("deve retornar os pedidos do usuário com sucesso", async () => {
    const user_uuid = "test-uuid";
    const mockUser = { id: 1, uuid: user_uuid };
    const mockOrders = [
      {
        id: 1,
        user_id: mockUser.id,
        status: "PENDING",
        items: [
          {
            id: 1,
            book_id: 1,
            quantity: 2,
            price: 20,
            book: { id: 1, title: "Book 1" },
          },
        ],
      },
    ];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderService.getOrdersByUser(user_uuid);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      include: {
        items: { include: { book: true } },
      },
    });
    expect(result).toEqual(mockOrders);
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    const user_uuid = "invalid-uuid";

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(orderService.getOrdersByUser(user_uuid)).rejects.toThrow(
      "Usuário não encontrado"
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
  });

  it("deve retornar uma lista vazia se o usuário não tiver pedidos", async () => {
    const user_uuid = "test-uuid";
    const mockUser = { id: 1, uuid: user_uuid };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    const result = await orderService.getOrdersByUser(user_uuid);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { uuid: user_uuid },
    });
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { user_id: mockUser.id },
      include: {
        items: { include: { book: true } },
      },
    });
    expect(result).toEqual([]);
  });
});
