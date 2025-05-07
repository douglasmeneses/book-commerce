import StepTwo from '../../src/components/StepTwo';

describe('StepTwo Component', () => {
  const defaultValues = {
    name: '',
    birthDate: '',
    cpf: '',
    phone: ''
  };

  beforeEach(() => {
    const onPrevious = cy.stub();
    const onSubmit = cy.stub();
    cy.mount(<StepTwo defaultValues={defaultValues} onPrevious={onPrevious} onSubmit={onSubmit} />);
  });

  it('renders all form fields', () => {
    cy.get('form').should('exist');
    cy.get('#name').should('exist');
    cy.get('#birthDate').should('exist');
    cy.get('#cpf').should('exist');
    cy.get('#phone').should('exist');
  });

  it('validates name field', () => {
    cy.get('#name').type('ab');
    cy.get('form').submit();
    cy.contains('O nome deve ter pelo menos 3 caracteres').should('exist');
  });

  it('validates birth date field', () => {
    cy.get('#birthDate').type('invalid-date');
    cy.get('form').submit();
    cy.contains('Data de nascimento inválida').should('exist');
  });

  it('formats and validates CPF field', () => {

    cy.get('#cpf').type('12345678900');
    cy.get('#cpf').should('have.value', '123.456.789-00');
    

    cy.get('form').submit();
    cy.contains('CPF inválido').should('exist');
  });

  it('validates phone field', () => {
    cy.get('#phone').type('123');
    cy.get('form').submit();
    cy.contains('O telefone deve estar no formato (11) 91234-5678').should('exist');
  });

  it('calls onSubmit with cleaned CPF when form is valid', () => {
    const onSubmit = cy.stub().as('onSubmit');
    cy.mount(
      <StepTwo 
        defaultValues={defaultValues} 
        onPrevious={cy.stub()} 
        onSubmit={onSubmit} 
      />
    );

    cy.get('#name').type('John Doe');
    cy.get('#birthDate').type('2000-01-01');
    cy.get('#cpf').type('39754317050'); 
    cy.get('#phone').type('11987654321');
    cy.get('form').submit();

    cy.get('@onSubmit').should('have.been.calledOnce');
    cy.get('@onSubmit').should('have.been.calledWithMatch', {
      name: 'John Doe',
      cpf: '39754317050' 
    });
  });

  it('calls onPrevious when back button is clicked', () => {
    const onPrevious = cy.stub().as('onPrevious');
    cy.mount(
      <StepTwo 
        defaultValues={defaultValues} 
        onPrevious={onPrevious} 
        onSubmit={cy.stub()} 
      />
    );

    cy.contains('Voltar').click();
    cy.get('@onPrevious').should('have.been.calledOnce');
  });
});