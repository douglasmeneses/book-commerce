import StepOne from '@/components/StepOne'

describe('<StepOne />', () => {
  it('renders registration form step 1', () => {
    cy.mount(<StepOne defaultValues={{
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }} onNext={cy.stub()} />)
    cy.contains('Apelido').should('exist')
  })
  

})