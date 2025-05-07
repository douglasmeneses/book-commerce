import PaymentMethods from '@/components/PaymentMethods'

describe('<PaymentMethods />', () => {
  it('renders all payment methods', () => {
    const onChangeStub = cy.stub()
    cy.mount(<PaymentMethods selected="PIX" onChange={onChangeStub} />)
    cy.contains('Pagamento').should('exist')
  })
  

})