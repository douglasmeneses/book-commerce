describe('Home Page', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('should display welcome message', () => {
      cy.contains('h1', 'Bem vindo à BookStore').should('be.visible')
    })
  
    it('should display book carousels', () => {
      cy.get('[data-cy="book-carousel"]').should('have.length.at.least', 1)
    })
  
    it('should allow favoriting books when logged in', () => {
     
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({ uuid: 'test-user' }))
      })
      
      cy.get('[data-cy="favorite-button"]').first().click()
    
      cy.wait('@favoriteBook').its('request.body').should('deep.equal', {
        book_uuid: 'book-123',
        user_uuid: 'test-user'
      })
    })
  })