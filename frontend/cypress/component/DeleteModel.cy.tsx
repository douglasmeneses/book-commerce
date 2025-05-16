import DeleteModel from "@/components/DeleteModel";
import { CartItem } from "@/types/cartTypes";

describe("<DeleteModel />", () => {
  const mockItem: CartItem = {
    id: 1,
    book: {
      uuid: "1",
      title: "Livro Teste",
      authors: ["Autor Teste"],
      image_url: "/test.jpg",
      price: 29.9,
      stock_quantity: 10,
      image: null,
    },
    price: 29.9,
    quantity: 1,
    cart_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const userUuid = "test-user";

  it('should open the confirmation dialog when "Remover" is clicked', () => {
    cy.mount(
      <DeleteModel
        user_uuid={userUuid}
        item={mockItem}
        deleteBookFunc={cy.stub()}
      />
    );

    // Simula o clique no botão de remover
    cy.get("button").contains("Remover").click();

    // Verifica se o diálogo de confirmação é exibido
    cy.contains(
      `Você tem certeza que deseja remover o livro ${mockItem.book.title}?`
    ).should("exist");
  });

  it("should call deleteBookFunc with correct arguments when confirmed", () => {
    const deleteStub = cy.stub();

    cy.mount(
      <DeleteModel
        user_uuid={userUuid}
        item={mockItem}
        deleteBookFunc={deleteStub}
      />
    );

    // Simula o clique no botão de remover
    cy.get("button").contains("Remover").click();

    // Simula o clique no botão de confirmação
    cy.get("button").contains("Sim").click();

    // Verifica se a função de deletar foi chamada com os argumentos corretos
    cy.wrap(deleteStub).should(
      "be.calledWith",
      mockItem.id,
      userUuid,
      mockItem.cart_id
    );
  });

  it('should close the dialog when "Não" is clicked', () => {
    cy.mount(
      <DeleteModel
        user_uuid={userUuid}
        item={mockItem}
        deleteBookFunc={cy.stub()}
      />
    );

    // Simula o clique no botão de remover
    cy.get("button").contains("Remover").click();

    // Simula o clique no botão de cancelar
    cy.get("button").contains("Não").click();

    // Verifica se o diálogo de confirmação foi fechado
    cy.contains(
      `Você tem certeza que deseja remover o livro ${mockItem.book.title}?`
    ).should("not.exist");
  });
});
