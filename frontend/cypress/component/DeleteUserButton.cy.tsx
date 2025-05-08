import DeleteUserButton from '@/components/DeleteUserButton'

describe('<DeleteUserButton />', () => {
  it('opens confirmation dialog', () => {
    cy.mount(<DeleteUserButton user_uuid="test-user" />)
    cy.get('button').contains('Deletar Usuário').click()
    cy.contains('Você tem certeza que deseja remover o Usuário?').should('exist')
  })

  it('calls delete service when confirmed', () => {
    cy.intercept('DELETE', '/api/users/test-user', {
      statusCode: 200
    }).as('deleteUser')
    
    cy.mount(<DeleteUserButton user_uuid="test-user" />)
    cy.get('button').contains('Deletar Usuário').click()
    cy.get('button').contains('Sim').click()
    cy.wait('@deleteUser')
  })
})