import FavoriteButton from '@/components/FavoriteButton'

describe('<FavoriteButton />', () => {
  it('renders favorite icon when favorited', () => {
    cy.mount(
      <FavoriteButton 
        book_uuid="1" 
        favorite={[{
            id: 0,
            book_id: 0,
            user_id: 0,
            created_at: '',
            updated_at: ''
        }]} 
        handleFavoriteBook={cy.stub()} 
        isLogin={true} 
      />
    )
    
    cy.get('[data-testid="favorite-icon"]').should('exist')
  })

  it('renders favorite border icon when not favorited', () => {
    cy.mount(
      <FavoriteButton 
        book_uuid="1" 
        favorite={[]} 
        handleFavoriteBook={cy.stub()} 
        isLogin={true} 
      />
    )
    
    cy.get('[data-testid="favorite-border-icon"]').should('exist')
  })

  it('shows login message when not logged in', () => {
    const toastStub = cy.stub()
    cy.mount(
      <FavoriteButton 
        book_uuid="1" 
        favorite={[]} 
        handleFavoriteBook={cy.stub()} 
        isLogin={false} 
      />
    )
    
    cy.get('[data-testid="favorite-border-icon"]').click()
    cy.wrap(toastStub).should('have.been.calledWith', 'Você precisa estar logado para favoritar um livro.')
  })
})