describe('Search Page', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:3001/books?search=test*', {
        fixture: 'searchResults.json'
      }).as('searchRequest')
      
      cy.visit('/search?query=test')
    })
  
    it('should display search results', () => {
      cy.wait('@searchRequest')
      cy.get('[data-cy="search-result"]').should('have.length.at.least', 1)
    })
  
    it('should allow adding items to cart', () => {
      cy.intercept('POST', 'http://localhost:3001/carts/user/*/item/*').as('addToCart')
      cy.get('[data-cy="add-to-cart"]').first().click()
      cy.wait('@addToCart').its('response.statusCode').should('eq', 200)
    })
  })