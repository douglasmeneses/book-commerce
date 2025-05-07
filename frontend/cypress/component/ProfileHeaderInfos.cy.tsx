import ProfileHeaderInfos from '@/components/ProfileHeaderInfos'
import { User } from '@/types/userTypes'

describe('<ProfileHeaderInfos />', () => {
  const mockUser: User = {
      uuid: '1',
      id: 123,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      avatar: 'https://example.com/avatar.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      birth_date: null,
      cpf: null,
      phone: null,
      isAdmin: false
  }

  it('renders user actions', () => {
    cy.mount(<ProfileHeaderInfos user={mockUser} />)
    cy.contains('PEDIDOS').should('exist')
  })
  
 
})