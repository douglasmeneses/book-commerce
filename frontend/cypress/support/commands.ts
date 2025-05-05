declare namespace Cypress {
  interface Chainable {
    apiRequest(method: string, url: string, data?: any, token?: string): Chainable<any>
    login(email: string, password: string): Chainable<any>
  }
}

Cypress.Commands.add('apiRequest', (method, url, data = {}, token = '') => {
  return cy.request({
    method,
    url,
    body: data,
    headers: {
      authorization: `Bearer ${token}`,
      'x-refresh-token': token,
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('login', (email, password) => {
  return cy.apiRequest('POST', 'http://localhost:3001/users/login', { email, password })
})