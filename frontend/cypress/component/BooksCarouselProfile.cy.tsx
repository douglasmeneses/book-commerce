import BooksCarouselProfile from "@/components/BooksCarouselProfile";
import { Book } from "@/types/bookTypes";

describe("<BooksCarouselProfile />", () => {
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
      publishers: [],
    },
  ];

  it("renders loading state", () => {
    cy.mount(
      <BooksCarouselProfile
        books={mockBooks}
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    cy.get('[data-testid="loading-spinner"]').should("exist");
  });

  it("renders books", () => {
    cy.mount(
      <BooksCarouselProfile
        books={mockBooks}
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se o título do livro é exibido
    cy.contains("Livro 1").should("exist");

    // Verifica se o preço do livro é exibido
    cy.contains("R$ 29,90").should("exist");

    // Verifica se a imagem do livro é exibida
    cy.get("img").should("have.attr", "src", "/book1.jpg");
  });

  it("shows empty message when no books", () => {
    cy.mount(
      <BooksCarouselProfile
        books={[]}
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se a mensagem de "Sem livros" é exibida
    cy.contains("Sem livros").should("exist");
  });

  it("handles favorite book action", () => {
    const handleFavoriteBook = cy.stub();

    cy.mount(
      <BooksCarouselProfile
        books={mockBooks}
        handleFavoriteBook={handleFavoriteBook}
        isLogin={true}
      />
    );

    // Simula o clique no botão de favoritar
    cy.get('[data-testid="favorite-button"]').first().click();

    // Verifica se a função de favoritar foi chamada
    cy.wrap(handleFavoriteBook).should("be.calledWith", "1");
  });
});
