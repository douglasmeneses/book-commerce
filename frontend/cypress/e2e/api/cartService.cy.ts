describe('Cart Service API Tests', () => {
  let authToken: string
  const userId = 'test-user-uuid'

  before(() => {
    cy.login('test@example.com', 'password123').then((response) => {
      authToken = response.body.token
    })
  })

  it('should get user cart', () => {
    cy.apiRequest('GET', `http://localhost:3001/carts/user/${userId}`, {}, authToken)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('items')
      })
  })

  it('should validate CORS for cart endpoints', () => {
    cy.request({
      method: 'OPTIONS',
      url: `http://localhost:3001/carts/user/${userId}`,
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET'
      }
    }).then((response) => {
      expect(response.status).to.eq(204)
      expect(response.headers).to.have.property('access-control-allow-methods')
    })
  })
})