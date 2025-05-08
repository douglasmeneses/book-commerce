describe('Favorite Service API Tests', () => {
  let authToken: string
  const userId = 'test-user-uuid'
  const bookId = 'book-123'

  before(() => {
    cy.login('test@example.com', 'password123').then((response) => {
      authToken = response.body.token
    })
  })

  it('should favorite a book', () => {
    cy.apiRequest('POST', `http://localhost:3001/favorites/book/${bookId}`, { user_uuid: userId }, authToken)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Book favorited successfully')
      })
  })
})