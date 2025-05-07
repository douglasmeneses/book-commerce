
import UserProfileCard from '@/components/UserProfileCard';
import { User } from '@/types/userTypes';

describe('UserProfileCard Component', () => {
  const mockUser: User = {
      id: 1,
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@example.com',
      address: {
          street: 'Main St',
          number: '123',
          city: 'New York',
          state: 'NY',
          neighborhood: '',
          postalCode: '',
          country: '',
          complement: null
      },
      created_at: new Date('2023-01-01').toISOString(),
      avatar: 'https://example.com/avatar.jpg',
      uuid: '',
      password: '',
      birth_date: null,
      cpf: null,
      phone: null,
      isAdmin: false,
      updated_at: ''
  };

  it('displays user information correctly', () => {
    cy.mount(<UserProfileCard user={mockUser} />);
    
    cy.contains('John Doe').should('exist');
    cy.contains('john@example.com').should('exist');
    cy.contains('Main St, 123, New York - NY').should('exist');
    cy.contains('01 de janeiro de 2023').should('exist');
    cy.get('img[src="https://example.com/avatar.jpg"]').should('exist');
  });

  it('shows fallback avatar when no image is provided', () => {
    const userWithoutAvatar = { ...mockUser, avatar: '' };
    cy.mount(<UserProfileCard user={userWithoutAvatar} />);
    
    cy.get('svg').should('exist'); 
  });

  it('handles missing user data gracefully', () => {
    cy.mount(<UserProfileCard user={null} />);
    
    cy.contains('Unknown').should('exist');
    cy.contains('N/A').should('exist').should('have.length', 4);
  });

  it('handles partial address information', () => {
    const userWithPartialAddress = {
      ...mockUser,
      address: {
        street: 'Main St',
        number: '',
        city: 'New York',
        state: '',
        zipCode: '',
        neighborhood: '',
        postalCode: '',
        country: '',
        complement: null
      }
    };
    cy.mount(<UserProfileCard user={userWithPartialAddress} />);
    
    cy.contains('Main St, , New York -').should('exist');
  });
});