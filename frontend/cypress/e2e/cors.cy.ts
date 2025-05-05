describe('CORS Configuration Tests', () => {
  const endpoints = [
    '/books',
    '/users/login',
    '/carts/user/test-user',
    '/orders/user/test-user',
    '/favorites/book/book-123',
  ];

  endpoints.forEach((endpoint) => {
    it(`should allow CORS for ${endpoint}`, () => {
      cy.request({
        method: 'OPTIONS',
        url: `http://localhost:3001${endpoint}`,
        headers: {
          Origin: 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
        },
      }).then((response) => {
        expect(response.status).to.eq(204);
        expect(response.headers).to.have.property('access-control-allow-origin');
        const allowedOrigin = response.headers['access-control-allow-origin'];
        // Aceita tanto '*' quanto 'http://localhost:3000'
        expect(['*', 'http://localhost:3000']).to.include(allowedOrigin);
      });
    });
  });
});