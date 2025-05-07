describe('User Service API Tests', () => {
  it('should register a new user', () => {
    const newUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    }

    cy.apiRequest('POST', 'http://localhost:3001/users/register', newUser)
      .then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('uuid')
      })
  })

  it('should login user', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    cy.apiRequest('POST', 'http://localhost:3001/users/login', credentials)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
      })
  })
})