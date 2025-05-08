describe('Book Service API Tests', () => {
  let authToken: string

  before(() => {
    cy.login('test@example.com', 'password123').then((response) => {
      authToken = response.body.token
    })
  })

  it('should get books with filter', () => {
    const filter = { category: 'fiction', page: 1 }
    cy.apiRequest('GET', 'http://localhost:3001/books', { params: filter }, authToken)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
  })

  it('should handle CORS headers', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3001/books',
      headers: {
        Origin: 'http://localhost:3000'
      }
    }).then((response) => {
      expect(response.headers).to.have.property('access-control-allow-origin')
      
    })
  })
})