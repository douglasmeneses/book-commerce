describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login')
      cy.intercept('POST', 'http://localhost:3001/users/login').as('loginRequest')
    })
  
    it('should display login form', () => {
      cy.get('form').should('exist')
      cy.get('[data-cy="email-input"]').should('exist')
      cy.get('[data-cy="password-input"]').should('exist')
    })
  
    it('should login successfully', () => {
      cy.get('[data-cy="email-input"]').type('test@example.com')
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="submit-button"]').click()
  
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body).to.have.property('token')
      })
    })
  })