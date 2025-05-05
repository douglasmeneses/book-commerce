describe('Profile Page', () => {
    beforeEach(() => {
      // Mock user data
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({
          uuid: 'test-user',
          name: 'Test User',
          email: 'test@example.com'
        }))
      })
      
      cy.intercept('GET', 'http://localhost:3001/favorites/user/test-user/', {
        fixture: 'favoriteBooks.json'
      }).as('getFavorites')
      
      cy.intercept('GET', 'http://localhost:3001/orders/user/test-user', {
        fixture: 'userOrders.json'
      }).as('getOrders')
      
      cy.visit('/profile')
    })
  
    it('should display user profile information', () => {
      cy.contains('Test User').should('be.visible')
      cy.contains('test@example.com').should('be.visible')
    })
  
    it('should display favorite books', () => {
      cy.wait('@getFavorites')
      cy.get('[data-cy="favorite-books"]').should('exist')
    })
  
    it('should display order history', () => {
      cy.wait('@getOrders')
      cy.get('[data-cy="order-history"]').should('exist')
    })
  })