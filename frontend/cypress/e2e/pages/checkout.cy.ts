describe('Checkout Page', () => {
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
      
      cy.intercept('POST', 'http://localhost:3001/orders/test-user').as('createOrder')
      
      cy.visit('/checkout')
    })
  
    it('should display order summary', () => {
      cy.wait('@getCart')
      cy.get('[data-cy="order-summary"]').should('exist')
    })
  
    it('should complete checkout', () => {
      cy.get('[data-cy="payment-method-pix"]').click()
      cy.get('[data-cy="confirm-order"]').click()
      
      cy.wait('@createOrder').then((interception) => {
        expect(interception.response?.statusCode).to.equal(201)
      })
      
      cy.url().should('include', '/pedidos')
    })
  })