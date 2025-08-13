import UserForm, { type UserFormProps } from './UserForm'

describe('<UserForm />', () => {
  const mountComponent = (
    props: Pick<UserFormProps, 'defaultValues' | 'isEditMode' | 'isPending'>,
  ) => {
    const onSubmit = cy.stub().as('onSubmit')

    const { defaultValues, isEditMode, isPending } = props

    cy.mount(
      <UserForm
        defaultValues={defaultValues}
        isEditMode={isEditMode}
        isPending={isPending}
        onSubmit={onSubmit}
      />,
    )
  }

  it('renders in create mode and submits valid data', () => {
    mountComponent({})

    cy.get('input[name="full_name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.get('@onSubmit').should('have.been.calledWithMatch', {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'COMMON',
      is_active: true,
    })
  })

  it('renders in edit mode with default values and submits changes', () => {
    cy.fixture('user').then(user => {
      mountComponent({ defaultValues: user, isEditMode: true })

      // Assert initial values
      cy.get('input[name="full_name"]').should('have.value', user.full_name)
      cy.get('input[name="email"]').should('have.value', user.email)
      cy.get('[data-testid="user-form-select"]').should('contain', user.role)

      // Change full name and toggle active status
      cy.get('input[name="full_name"]').clear().type('Jane Doe')

      cy.get('button[type="submit"]').click()

      cy.get('@onSubmit').should('have.been.calledWithMatch', {
        full_name: 'Jane Doe',
      })
    })
  })

  it('renders pending state', () => {
    cy.fixture('user').then(user => {
      mountComponent({ defaultValues: user, isPending: true, isEditMode: true })

      cy.get('[data-testid="user-form-submit"]').should(
        'have.text',
        'Saving...',
      )
    })
  })

  // it('displays validation errors for empty fields in create mode', () => {
  //   const onSubmitSpy = cy.spy().as('onSubmitSpy')

  //   cy.mount(<UserForm onSubmit={onSubmitSpy} />)

  //   cy.get('button[type="submit"]').click()

  //   cy.get('.form-message').should('have.length.at.least', 3) // full_name, email, password, role
  //   cy.get('.form-message').contains('String must contain at least 1 character')
  //   cy.get('.form-message').contains('Invalid email')
  //   cy.get('.form-message').contains('Required')

  //   cy.get('@onSubmitSpy').should('not.have.been.called')
  // })

  // it('disables submit button and shows loading text when isPending is true', () => {
  //   const onSubmitSpy = cy.spy().as('onSubmitSpy')

  //   cy.mount(<UserForm onSubmit={onSubmitSpy} isPending={true} />)

  //   cy.get('button[type="submit"]')
  //     .should('be.disabled')
  //     .and('contain', 'Saving...')
  // })

  // it('password field is not visible in edit mode', () => {
  //   cy.mount(<UserForm onSubmit={cy.spy()} isEditMode={true} />)
  //   cy.get('input[name="password"]').should('not.exist')
  // })

  // it('password field is visible in create mode', () => {
  //   cy.mount(<UserForm onSubmit={cy.spy()} isEditMode={false} />)
  //   cy.get('input[name="password"]').should('exist')
  // })
})
