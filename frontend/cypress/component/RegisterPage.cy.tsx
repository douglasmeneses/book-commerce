import RegisterPage from '@/components/RegisterPage'

describe('<RegisterPage />', () => {
  it('renders registration form', () => {
    cy.mount(<RegisterPage />)
    cy.contains('Registre sua conta na BookStore').should('exist')
  })
  
  
})