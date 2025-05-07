describe('Cart Page', () => {
    beforeEach(() => {
      // Mock user data
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({
          uuid: 'test-user'
        }))
      })
      
      cy.intercept('GET', 'http://localhost:3001/carts/user/test-user', {
        fixture: 'userCart.json'
      }).as('getCart')
      
      cy.visit('/cart')
    })
  
    it('should display cart items', () => {
      cy.wait('@getCart')
      cy.get('[data-cy="cart-item"]').should('have.length.at.least', 1)
    })
  
    it('should allow increasing item quantity', () => {
      cy.intercept('POST', 'http://localhost:3001/carts/user/test-user/item/*').as('addItem')
      cy.get('[data-cy="increase-quantity"]').first().click()
      cy.wait('@addItem').its('response.statusCode').should('eq', 200)
    })
  })