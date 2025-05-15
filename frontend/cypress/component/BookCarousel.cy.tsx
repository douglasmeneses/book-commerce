import BookCarousel from "@/components/BookCarousel";
import { Book } from "@/types/bookTypes";

describe("<BookCarousel />", () => {
  const mockBooks: Book[] = [
    {
      uuid: "1",
      id: 1,
      title: "Livro 1",
      synopsis: "Sinopse do Livro 1",
      language: "Português",
      price: "29.90",
      ISBN: "123456789",
      rating: "4.5",
      favorite_count: 10,
      page_count: 200,
      stock_quantity: 5,
      release_date: "2023-01-01",
      created_at: "",
      updated_at: "",
      image_url: "/book1.jpg",
      authors: ["Autor 1"],
      genres: [],
      favorites: [],
      publishers: [], // <-- Adicione esta linha
    },
    {
      uuid: "2",
      id: 2,
      title: "Livro 2",
      synopsis: "Sinopse do Livro 2",
      language: "Português",
      price: "39.90",
      ISBN: "987654321",
      rating: "4.0",
      favorite_count: 5,
      page_count: 300,
      stock_quantity: 3,
      release_date: "2023-02-01",
      created_at: "",
      updated_at: "",
      image_url: "/book2.jpg",
      authors: ["Autor 2"],
      genres: [],
      favorites: [],
      publishers: [], // <-- Adicione esta linha
    },
  ];

  it("renderiza corretamente com livros", () => {
    cy.mount(
      <BookCarousel
        books={mockBooks}
        genres={["Fantasia", "Aventura"]}
        title="Livros em Destaque"
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    cy.contains("Livros em Destaque").should("be.visible");

    cy.get('[data-cy="book-item"]').should("have.length", mockBooks.length);

    cy.contains("R$ 29,90").should("be.visible");
    cy.contains("Livro 1").should("be.visible");
    cy.contains("R$ 39,90").should("be.visible");
    cy.contains("Livro 2").should("be.visible");
  });

  it("filtra livros por gênero", () => {
    cy.intercept("GET", "/api/books*", {
      body: [mockBooks[0]],
    }).as("getBooks");

    cy.mount(
      <BookCarousel
        books={mockBooks}
        genres={["Fantasia", "Aventura"]}
        title="Livros em Destaque"
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    cy.contains("Fantasia").click();

    cy.wait("@getBooks");

    cy.get('[data-cy="book-item"]').should("have.length", 1);
    cy.contains("Livro 1").should("be.visible");
  });

  it("adiciona livro ao carrinho", () => {
    cy.mount(
      <BookCarousel
        books={mockBooks}
        genres={["Fantasia", "Aventura"]}
        title="Livros em Destaque"
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    cy.contains("Adicionar").first().click();

    cy.contains("Livro adicionado ao carrinho com sucesso!").should(
      "be.visible"
    );
  });
});
