import CartItemsList from "@/components/CartItemsList";
import { Cart } from "@/types/cartTypes";

describe("<CartItemsList />", () => {
  const mockCart: Cart = {
    totalPrice: 29.9,
    cartItem: [
      {
        cart_id: 1,
        id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        price: 29.9,
        quantity: 1,
        book: {
          uuid: "1",
          title: "Livro 1",
          price: 29.9,
          image: null,
          image_url: "/book1.jpg",
          stock_quantity: 10,
          authors: ["Autor 1"],
        },
      },
    ],
  };

  it("renders cart items", () => {
    cy.mount(
      <CartItemsList
        user_uuid="test-user"
        cart={mockCart}
        handleAddItem={cy.stub()}
        handleRemoveItem={cy.stub()}
        handleDeleteItem={cy.stub()}
      />
    );

    // Verifica se o título do livro é exibido
    cy.contains("Livro 1").should("exist");

    // Verifica se o preço do livro é exibido
    cy.contains("R$ 29,90").should("exist");

    // Verifica se a imagem do livro é exibida
    cy.get("img").should("have.attr", "src", "/book1.jpg");

    // Verifica se o status de estoque é exibido
    cy.contains("Em estoque").should("exist");
  });

  it("shows empty message when no items", () => {
    cy.mount(
      <CartItemsList
        user_uuid="test-user"
        cart={{ totalPrice: 0, cartItem: [] }}
        handleAddItem={cy.stub()}
        handleRemoveItem={cy.stub()}
        handleDeleteItem={cy.stub()}
      />
    );

    // Verifica se a mensagem de carrinho vazio é exibida
    cy.contains("Seu carrinho está vazio").should("exist");
  });

  it("handles adding an item", () => {
    const handleAddItem = cy.stub();

    cy.mount(
      <CartItemsList
        user_uuid="test-user"
        cart={mockCart}
        handleAddItem={handleAddItem}
        handleRemoveItem={cy.stub()}
        handleDeleteItem={cy.stub()}
      />
    );

    // Simula o clique no botão de adicionar item
    cy.get('[data-testid="add-item-button"]').first().click();

    // Verifica se a função de adicionar item foi chamada
    cy.wrap(handleAddItem).should("be.calledWith", "test-user", "1", 1);
  });

  it("handles removing an item", () => {
    const handleRemoveItem = cy.stub();

    cy.mount(
      <CartItemsList
        user_uuid="test-user"
        cart={mockCart}
        handleAddItem={cy.stub()}
        handleRemoveItem={handleRemoveItem}
        handleDeleteItem={cy.stub()}
      />
    );

    // Simula o clique no botão de remover item
    cy.get('[data-testid="remove-item-button"]').first().click();

    // Verifica se a função de remover item foi chamada
    cy.wrap(handleRemoveItem).should("be.calledWith", "test-user", 1, 1);
  });

  it("handles deleting an item", () => {
    const handleDeleteItem = cy.stub();

    cy.mount(
      <CartItemsList
        user_uuid="test-user"
        cart={mockCart}
        handleAddItem={cy.stub()}
        handleRemoveItem={cy.stub()}
        handleDeleteItem={handleDeleteItem}
      />
    );

    // Simula o clique no botão de deletar item
    cy.get('[data-testid="delete-item-button"]').first().click();

    // Verifica se a função de deletar item foi chamada
    cy.wrap(handleDeleteItem).should("be.calledWith", 1, "test-user");
  });
});
