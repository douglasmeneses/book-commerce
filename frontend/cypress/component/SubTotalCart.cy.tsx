import SubTotalCart from "@/components/SubTotalCart";
import { Cart } from "@/types/cartTypes";

describe("<SubTotalCart />", () => {
  const mockCart: Cart = {
    cartItem: [
      {
        cart_id: 1, // Ajustado para ser uma função
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        price: 10,
        quantity: 2,
        book: {
          uuid: "1",
          title: "Book 1",
          price: 10,
          image: null,
          image_url: "/book1.jpg",
          stock_quantity: 10,
          authors: ["Author 1"],
        },
      },
      {
        cart_id: 2, // Ajustado para ser uma função
        id: 2,
        created_at: new Date(),
        updated_at: new Date(),
        price: 20,
        quantity: 1,
        book: {
          uuid: "2",
          title: "Book 2",
          price: 20,
          image: null,
          image_url: "/book2.jpg",
          stock_quantity: 5,
          authors: ["Author 2"],
        },
      },
    ],
    totalPrice: 40,
  };

  beforeEach(() => {
    cy.mount(<SubTotalCart cart={mockCart} />);
  });

  it("displays correct subtotal information", () => {
    // Verifica se o subtotal está correto
    cy.contains("Subtotal (3 Produtos)").should("exist");
    cy.contains("R$ 40,00").should("exist");
  });

  it("shows success toast when purchase button is clicked", () => {
    // Simula o clique no botão de concluir compra
    cy.get("button").contains("Concluir Compra").click();

    // Verifica se a mensagem de sucesso é exibida
    cy.contains("Compra realizada com sucesso!").should("exist");
  });

  it("handles empty cart gracefully", () => {
    const emptyCart: Cart = {
      cartItem: [],
      totalPrice: 0,
    };

    // Monta o componente com um carrinho vazio
    cy.mount(<SubTotalCart cart={emptyCart} />);

    // Verifica se o subtotal para carrinho vazio está correto
    cy.contains("Subtotal (0 Produtos)").should("exist");
    cy.contains("R$ 0,00").should("exist");
  });

  it("displays correct item count", () => {
    // Verifica se o número total de itens no carrinho está correto
    cy.contains("Subtotal (3 Produtos)").should("exist");
  });

  it("handles cart with one item correctly", () => {
    const singleItemCart: Cart = {
      cartItem: [
        {
          cart_id: 1, // Ajustado para ser uma função
          id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          price: 15,
          quantity: 1,
          book: {
            uuid: "1",
            title: "Single Book",
            price: 15,
            image: null,
            image_url: "/singlebook.jpg",
            stock_quantity: 5,
            authors: ["Author 1"],
          },
        },
      ],
      totalPrice: 15,
    };

    // Monta o componente com um carrinho contendo apenas um item
    cy.mount(<SubTotalCart cart={singleItemCart} />);

    // Verifica se o subtotal para um item está correto
    cy.contains("Subtotal (1 Produto)").should("exist");
    cy.contains("R$ 15,00").should("exist");
  });
});
