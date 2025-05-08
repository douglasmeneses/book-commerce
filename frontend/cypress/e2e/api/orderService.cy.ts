describe('Order Service API Tests', () => {
  let authToken: string
  const userId = 'test-user-uuid'

  before(() => {
    cy.login('test@example.com', 'password123').then((response) => {
      authToken = response.body.token
    })
  })

  it('should create an order', () => {
    const orderData = {
      items: [{ bookId: '1', quantity: 2 }],
      total: 50.00
    }

    cy.apiRequest('POST', `http://localhost:3001/orders/${userId}`, orderData, authToken)
      .then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('orderId')
      })
  })
})