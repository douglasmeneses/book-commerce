import QuantitySelectorButtons from "@/components/QuantitySelectorButtons";
import { CartItem } from "@/types/cartTypes";

describe("<QuantitySelectorButtons />", () => {
  const mockItem: CartItem = {
    cart_id: 1, // Ajustado para ser uma função
    id: 1,
    book: {
      uuid: "1",
      title: "Livro Teste",
      authors: ["Autor Teste"],
      image_url: "/test.jpg",
      price: 29.9,
      image: null,
      stock_quantity: 10,
    },
    price: 29.9,
    quantity: 2,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it("renders quantity controls", () => {
    cy.mount(
      <QuantitySelectorButtons
        user_uuid="test-user"
        item={mockItem}
        handleAddItem={cy.stub()}
        handleRemoveItem={cy.stub()}
        handleDeleteItem={cy.stub()}
      />
    );
    cy.contains("2").should("exist");
  });
});
