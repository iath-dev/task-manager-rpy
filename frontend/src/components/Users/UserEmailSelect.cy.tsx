import UserEmailSelect from './UserEmailSelect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

const queryClient = new QueryClient()

describe('<UserEmailSelect />', () => {
  beforeEach(() => {
    // Set up common API intercepts
    cy.intercept('GET', '**/users/emails', { fixture: 'users-emails' }).as(
      'getUsers',
    )
  })

  beforeEach(() => {
    cy.fixture('auth').then(auth => {
      cy.window().then(win => {
        win.useAuthStore = useAuthStore

        useAuthStore.setState({
          user: auth.user,
          token: auth['access_token'],
          isAuthenticated: true,
        })
      })
    })
  })

  const mountComponent = (value: string = '') => {
    const onValueChange = cy.stub().as('onValueChange')

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <UserEmailSelect value={value} onValueChange={onValueChange} />
      </QueryClientProvider>,
    )
  }

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()
    cy.get('[data-testid="users-email-popover-button"]').should('exist')
  })

  it('should render user@example.com', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent('user@example.com')
    cy.get('[data-testid="users-email-popover-button"]').type(
      'user@example.com',
    )
  })

  it('should open users popover', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()
    cy.get('[data-testid="users-email-popover-button"]').click()

    cy.wait('@getUsers')

    cy.fixture('users-emails').each(email => {
      cy.get(`[data-testid='user-item-${email}']`).should('exist')
    })
  })

  it('should call onValue change', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()
    cy.get('[data-testid="users-email-popover-button"]').click()

    cy.wait('@getUsers')

    cy.get('[data-testid="user-item-user1@example.com"]').click()

    cy.get('@onValueChange').should(
      'have.been.called.with',
      'user1@example.com',
    )
  })
})
