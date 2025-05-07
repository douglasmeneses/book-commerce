import OrderReview from '@/components/OrderReview'

describe('<OrderReview />', () => {
  const mockItems = [
    {
      title: 'Livro 1',
      author: 'Autor 1',
      quantity: 1,
      price: 29.90,
      image: '/book1.jpg'
    }
  ]

  it('renders order items', () => {
    cy.mount(<OrderReview items={mockItems} />)
    cy.contains('Revisar pedido').should('exist')
  })
  

})