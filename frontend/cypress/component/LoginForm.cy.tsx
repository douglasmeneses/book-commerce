import LoginForm from '@/components/LoginForm'

describe('<LoginForm />', () => {
  it('renders login form', () => {
    cy.mount(<LoginForm />)
    cy.get('form').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })

  it('validates form inputs', () => {
    cy.mount(<LoginForm />)
    cy.get('button[type="submit"]').click()
    cy.contains('Email inválido').should('exist')
    cy.contains('Senha deve ter pelo menos 8 caracteres').should('exist')
  })

  it('submits form with valid data', () => {
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        user: { name: 'Test User' }
      }
    }).as('loginRequest')
    
    cy.mount(<LoginForm />)
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123'
    })
  })
})