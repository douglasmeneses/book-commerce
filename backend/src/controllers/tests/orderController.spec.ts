import * as orderController from "../orderController";
import { mockRequest, mockResponse } from "./__utils__/index";

describe("orderController.createOrder", () => {
  beforeEach(() => {
    (orderController.service.createOrder as jest.Mock) = jest.fn();
  });

  it("deve criar uma ordem com sucesso", async () => {
    const req = mockRequest({
      params: { user_uuid: "user123" },
      body: { items: [{ book_uuid: "book456", quantity: 2 }] },
    });
    const res = mockResponse();

    const mockOrder = {
      id: 1,
      user_uuid: "user123",
      items: [{ book_uuid: "book456", quantity: 2 }],
    };

    (orderController.service.createOrder as jest.Mock).mockResolvedValue(
      mockOrder
    );

    await orderController.createOrder(req, res);

    expect(orderController.service.createOrder).toHaveBeenCalledWith(
      "user123",
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it("deve lidar com erros ao criar uma ordem", async () => {
    const req = mockRequest({
      params: { user_uuid: "user123" },
      body: { items: [{ book_uuid: "book456", quantity: 2 }] },
    });
    const res = mockResponse();

    const mockError = new Error("Falha ao criar ordem");
    (orderController.service.createOrder as jest.Mock).mockRejectedValue(
      mockError
    );

    await orderController.createOrder(req, res);

    expect(orderController.service.createOrder).toHaveBeenCalledWith(
      "user123",
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
});
describe("orderController.getOrderById", () => {
  beforeEach(() => {
    (orderController.service.getOrderById as jest.Mock) = jest.fn();
  });

  it("deve retornar uma ordem pelo ID com sucesso", async () => {
    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    const mockOrder = { id: 1, user_uuid: "user123", items: [] };

    (orderController.service.getOrderById as jest.Mock).mockResolvedValue(
      mockOrder
    );

    await orderController.getOrderById(req, res);

    expect(orderController.service.getOrderById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it("deve lidar com erros ao buscar uma ordem pelo ID", async () => {
    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    const mockError = new Error("Ordem não encontrada");
    (orderController.service.getOrderById as jest.Mock).mockRejectedValue(
      mockError
    );

    await orderController.getOrderById(req, res);

    expect(orderController.service.getOrderById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
});

describe("orderController.updateOrder", () => {
  beforeEach(() => {
    (orderController.service.updateOrder as jest.Mock) = jest.fn();
  });

  it("deve atualizar uma ordem com sucesso", async () => {
    const req = mockRequest({
      params: { user_uuid: "user123" },
      body: { items: [{ book_uuid: "book456", quantity: 3 }] },
    });
    const res = mockResponse();

    const mockUpdatedOrder = {
      id: 1,
      user_uuid: "user123",
      items: [{ book_uuid: "book456", quantity: 3 }],
    };

    (orderController.service.updateOrder as jest.Mock).mockResolvedValue(
      mockUpdatedOrder
    );

    await orderController.updateOrder(req, res);

    expect(orderController.service.updateOrder).toHaveBeenCalledWith(
      "user123",
      req.body
    );
    expect(res.json).toHaveBeenCalledWith(mockUpdatedOrder);
  });

  it("deve lidar com erros ao atualizar uma ordem", async () => {
    const req = mockRequest({
      params: { user_uuid: "user123" },
      body: { items: [{ book_uuid: "book456", quantity: 3 }] },
    });
    const res = mockResponse();

    const mockError = new Error("Falha ao atualizar ordem");
    (orderController.service.updateOrder as jest.Mock).mockRejectedValue(
      mockError
    );

    await orderController.updateOrder(req, res);

    expect(orderController.service.updateOrder).toHaveBeenCalledWith(
      "user123",
      req.body
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
});

describe("orderController.deleteOrder", () => {
  beforeEach(() => {
    (orderController.service.deleteOrder as jest.Mock) = jest.fn();
  });

  it("deve deletar uma ordem com sucesso", async () => {
    const req = mockRequest({ params: { user_uuid: "user123" } });
    const res = mockResponse();

    const mockResult = { success: true };

    (orderController.service.deleteOrder as jest.Mock).mockResolvedValue(
      mockResult
    );

    await orderController.deleteOrder(req, res);

    expect(orderController.service.deleteOrder).toHaveBeenCalledWith("user123");
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it("deve lidar com erros ao deletar uma ordem", async () => {
    const req = mockRequest({ params: { user_uuid: "user123" } });
    const res = mockResponse();

    const mockError = new Error("Falha ao deletar ordem");
    (orderController.service.deleteOrder as jest.Mock).mockRejectedValue(
      mockError
    );

    await orderController.deleteOrder(req, res);

    expect(orderController.service.deleteOrder).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
});

describe("orderController.getOrdersByUser", () => {
  beforeEach(() => {
    (orderController.service.getOrdersByUser as jest.Mock) = jest.fn();
  });

  it("deve retornar ordens de um usuário com sucesso", async () => {
    const req = mockRequest({ params: { user_uuid: "user123" } });
    const res = mockResponse();

    const mockOrders = [
      { id: 1, user_uuid: "user123", items: [] },
      { id: 2, user_uuid: "user123", items: [] },
    ];

    (orderController.service.getOrdersByUser as jest.Mock).mockResolvedValue(
      mockOrders
    );

    await orderController.getOrdersByUser(req, res);

    expect(orderController.service.getOrdersByUser).toHaveBeenCalledWith(
      "user123"
    );
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it("deve lidar com erros ao buscar ordens de um usuário", async () => {
    const req = mockRequest({ params: { user_uuid: "user123" } });
    const res = mockResponse();

    const mockError = new Error("Falha ao buscar ordens");
    (orderController.service.getOrdersByUser as jest.Mock).mockRejectedValue(
      mockError
    );

    await orderController.getOrdersByUser(req, res);

    expect(orderController.service.getOrdersByUser).toHaveBeenCalledWith(
      "user123"
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
  });
});
