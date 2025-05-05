import Footer from '@/components/Footer'

describe('<Footer />', () => {
  it('renders footer content', () => {
    cy.mount(<Footer />)
    cy.contains('Bookstore').should('exist')
    cy.contains('Voltar ao topo').should('exist')
  })

  it('scrolls to top when clicked', () => {
    cy.mount(<Footer />)
    const scrollToStub = cy.stub(window, 'scrollTo')
    cy.contains('Voltar ao topo').click()
    cy.wrap(scrollToStub).should('be.calledWith', { top: 0, behavior: 'smooth' })
  })
})