import { SearchBar } from '@/components/SearchBar'

describe('<SearchBar />', () => {
  it('renders search input', () => {
    cy.mount(<SearchBar />)
    cy.get('input[placeholder="Search"]').should('exist')
  })
  

})