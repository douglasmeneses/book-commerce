describe('Profile Update Page', () => {
    beforeEach(() => {
      // Mock user data
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({
          uuid: 'test-user',
          name: 'Test User'
        }))
      })
      
      cy.intercept('PUT', 'http://localhost:3001/users/test-user').as('updateProfile')
      cy.visit('/profile/update')
    })
  
    it('should display update form', () => {
      cy.get('form').should('exist')
      cy.get('[data-cy="name-input"]').should('exist')
      cy.get('[data-cy="username-input"]').should('exist')
    })
  
    it('should update profile information', () => {
      cy.get('[data-cy="name-input"]').clear().type('Updated Name')
      cy.get('[data-cy="submit-button"]').click()
  
      cy.wait('@updateProfile').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
      })
    })
  })