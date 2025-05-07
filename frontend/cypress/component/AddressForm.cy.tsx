import AddressForm from '@/components/AddressForm'
import { Address } from '@/types/userTypes'

describe('<AddressForm />', () => {
  it('renders loading state', () => {
    cy.mount(<AddressForm />)
    cy.contains('Carregando endereço...').should('exist')
  })

  it('renders error state', () => {
    const error = 'Erro ao buscar endereço'
    cy.intercept('GET', '/api/user/*/address', {
      statusCode: 500,
      body: { message: error }
    })
    
    cy.mount(<AddressForm />)
    cy.contains(error).should('exist')
  })

  it('renders address data', () => {
    const mockAddress: Address = {
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01001000',
        country: 'Brasil',
        complement: null
    }
    
    cy.intercept('GET', '/api/user/*/address', {
      statusCode: 200,
      body: mockAddress
    })
    
    cy.mount(<AddressForm />)
    cy.contains(`${mockAddress.street}, ${mockAddress.number}`).should('exist')
  })
})