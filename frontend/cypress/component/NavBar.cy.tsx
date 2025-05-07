import NavBar from '@/components/NavBar'
import { MemoryRouter } from 'react-router-dom'


describe('<NavBar />', () => {
  it('renders with logo and search', () => {
    cy.mount(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    )
    cy.get('img[alt="Logo"]').should('exist')
    cy.get('input[placeholder="Procurar"]').should('exist')
  })
 
})