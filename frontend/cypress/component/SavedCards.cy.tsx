import SavedCards from '@/components/SavedCards'

describe('<SavedCards />', () => {
  const mockCards = [
    {
      id: 1,
      number: "**** **** **** 1289",
      balance: 5750.2,
      expiry: "09/25",
      color: "red"
    }
  ]

  it('renders saved cards', () => {
    const selectStub = cy.stub()
    cy.mount(<SavedCards cards={mockCards} selected={null} onSelect={selectStub} />)
    cy.contains('Cartões').should('exist')
  })
  
  
})