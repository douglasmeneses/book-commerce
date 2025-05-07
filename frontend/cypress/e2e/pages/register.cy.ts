describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register')
      cy.intercept('POST', 'http://localhost:3001/users/register').as('registerRequest')
    })
  
    it('should display registration form', () => {
      cy.get('form').should('exist')
      cy.get('[data-cy="name-input"]').should('exist')
      cy.get('[data-cy="email-input"]').should('exist')
      cy.get('[data-cy="password-input"]').should('exist')
    })
  
    it('should register new user', () => {
      const testEmail = `test${Date.now()}@example.com`
      
      cy.get('[data-cy="name-input"]').type('Test User')
      cy.get('[data-cy="email-input"]').type(testEmail)
      cy.get('[data-cy="password-input"]').type('password123')
      cy.get('[data-cy="submit-button"]').click()
  
      cy.wait('@registerRequest').then((interception) => {
        expect(interception.response?.statusCode).to.equal(201)
        expect(interception.response?.body).to.have.property('uuid')
      })
    })
  })