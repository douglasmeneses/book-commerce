import ConfirmOrder from '@/components/ConfirmOrder'

describe('<ConfirmOrder />', () => {
  it('renders total and confirm button', () => {
    const confirmStub = cy.stub()
    cy.mount(<ConfirmOrder total={99.90} onConfirm={confirmStub} />)
    
    cy.contains('R$ 99.90').should('exist')
    cy.contains('Confirmar Compra').click()
    cy.wrap(confirmStub).should('be.called')
  })
})