import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UsersListHeader from './UsersListHeader'

const queryClient = new QueryClient()

describe('<UsersListHeader />', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/users').as('createUser')
  })

  const mountComponent = () => {
    const onFilterChange = cy.stub().as('onFilterChange')

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <UsersListHeader onFilterChange={onFilterChange} />
      </QueryClientProvider>,
    )
  }

  it('renders', () => {
    mountComponent()

    cy.get('[data-testid="user-list-header"]').should('exist')
  })

  it('change query', () => {
    mountComponent()

    cy.get('input[placeholder="Search by name"]').type('User 01')

    cy.wait(500)

    cy.get('@onFilterChange').should('have.been.calledWithMatch', {
      search: 'User 01',
    })
  })

  it('fill user form', () => {
    mountComponent()

    cy.get('[data-testid="user-list-header-add"]').click()

    cy.get('input[name="full_name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')

    cy.get('button[type="submit"]').click()

    cy.wait('@createUser').then(interception => {
      expect(interception.request.body.full_name).to.equal('Test User')
    })
  })
})
