import ProfileBooksSection from "@/components/ProfileBooksSection";
import { Book } from "@/types/bookTypes";

describe("<ProfileBooksSection />", () => {
  const mockBooks: Book[] = [
    {
      uuid: "1",
      id: 1,
      title: "Livro Favorito",
      synopsis: "Sinopse do Livro Favorito",
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

  it("renders favorite and order sections", () => {
    cy.mount(
      <ProfileBooksSection
        favoritedBooks={mockBooks}
        LatestOrders={mockBooks}
        recomendations={[]} // <-- Adicione esta linha
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se a seção de favoritos é renderizada
    cy.contains("Favoritos").should("exist");

    // Verifica se a seção de últimos pedidos é renderizada
    cy.contains("Últimos Pedidos").should("exist");
  });

  it("renders books in favorite section", () => {
    cy.mount(
      <ProfileBooksSection
        favoritedBooks={mockBooks}
        LatestOrders={[]}
        recomendations={[]} // <-- Adicione esta linha
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se o título do livro favorito é exibido
    cy.contains("Livro Favorito").should("exist");

    // Verifica se o preço do livro favorito é exibido
    cy.contains("R$ 29,90").should("exist");

    // Verifica se a imagem do livro favorito é exibida
    cy.get("img").should("have.attr", "src", "/book1.jpg");
  });

  it("renders books in latest orders section", () => {
    cy.mount(
      <ProfileBooksSection
        favoritedBooks={[]}
        LatestOrders={mockBooks}
        recomendations={[]} // <-- Adicione esta linha
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se o título do livro nos últimos pedidos é exibido
    cy.contains("Livro Favorito").should("exist");

    // Verifica se o preço do livro nos últimos pedidos é exibido
    cy.contains("R$ 29,90").should("exist");

    // Verifica se a imagem do livro nos últimos pedidos é exibida
    cy.get("img").should("have.attr", "src", "/book1.jpg");
  });

  it("handles favorite book action", () => {
    const handleFavoriteBook = cy.stub();

    cy.mount(
      <ProfileBooksSection
        favoritedBooks={mockBooks}
        LatestOrders={[]}
        recomendations={[]} // <-- Adicione esta linha
        handleFavoriteBook={handleFavoriteBook}
        isLogin={true}
      />
    );

    // Simula o clique no botão de favoritar
    cy.get('[data-testid="favorite-button"]').first().click();

    // Verifica se a função de favoritar foi chamada
    cy.wrap(handleFavoriteBook).should("be.calledWith", "1");
  });

  it("shows empty state when no books", () => {
    cy.mount(
      <ProfileBooksSection
        favoritedBooks={[]}
        LatestOrders={[]}
        recomendations={[]} // <-- Adicione esta linha
        handleFavoriteBook={cy.stub()}
        isLogin={true}
      />
    );

    // Verifica se a mensagem de "Sem livros" é exibida para favoritos
    cy.contains("Você ainda não favoritou nenhum livro.").should("exist");

    // Verifica se a mensagem de "Sem livros" é exibida para últimos pedidos
    cy.contains("Você ainda não realizou nenhum pedido.").should("exist");
  });
});
