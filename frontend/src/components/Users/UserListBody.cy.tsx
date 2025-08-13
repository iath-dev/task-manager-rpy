import UserListContent from './UsersListBody'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { User } from '@/interfaces/user'

const queryClient = new QueryClient()

describe('<UserListContent />', () => {
  beforeEach(() => {
    cy.fixture('users').as('users')
  })

  const mountComponent = () => {
    cy.get('@users').then(users => {
      cy.mount(
        <QueryClientProvider client={queryClient}>
          <UserListContent users={users} />
        </QueryClientProvider>,
      )
    })
  }

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()

    cy.get('[data-testid="users-list"]').should('exist')

    cy.get('@users').then(users => {
      cy.get('[data-testid="users-list"] li').should(
        'have.length',
        users.length,
      )

      users.forEach((user: User) => {
        cy.contains('li', user.full_name)
          .should('be.visible')
          .within(() => {
            cy.contains(/Last access/)

            if (!user.is_active) {
              cy.contains(/Inactive/)
            }
          })
      })
    })
  })

  it('should open edit modal', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()

    cy.get('[data-testid="users-list"]').should('exist')

    cy.get('@users').then((users: User[]) => {
      cy.get('[data-testid="users-list"] li').should(
        'have.length',
        users.length,
      )

      const user = users[0]

      cy.get(
        `[data-testid="users-list-${user.email}"] [data-testid="users-list-edit"]`,
      ).click()

      cy.get('[data-testid="user-form-dialog-title"]').should('be.visible')
    })
  })
})
