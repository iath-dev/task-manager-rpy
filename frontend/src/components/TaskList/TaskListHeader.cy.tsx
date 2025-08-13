import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { PaginatedResponse } from '@/interfaces/pagination'
import type { Task } from '@/interfaces/tasks'
import { useTaskStore } from '@/store/taskStore'

import TaskListHeader from './TaskListHeader'
import { useAuthStore } from '../../store/authStore'

const queryClient = new QueryClient()

const userEmails = ['admin@example.com', 'user@example.com']

describe('<TaskListHeader />', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    cy.window().then(win => {
      win.useTaskStore = useTaskStore
      useTaskStore.setState(useTaskStore.getInitialState())
    })

    // Set up common API intercepts
    cy.intercept('GET', '**/users/emails', userEmails).as('getUsers')
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

  const mountComponent = () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <TaskListHeader />
      </QueryClientProvider>,
    )
  }

  it('renders the search input', () => {
    mountComponent()
    cy.get('input[placeholder="Search"]').should('be.visible')
  })

  it('renders the create task button', () => {
    mountComponent()
    cy.get('[data-testid="create-task-button"]').should('be.visible')
  })

  it('allows typing in the search input', () => {
    mountComponent()
    cy.get('input[placeholder="Search"]').type('Test')
    cy.get('input[placeholder="Search"]').should('have.value', 'Test')
  })

  it('calls to filter to open the users filter', () => {
    mountComponent()
    cy.get('[data-testid="users-email-popover-button"]').click()
    cy.get('[data-testid="users-email-command"]').should('be.visible')

    cy.wait('@getUsers')

    userEmails.forEach(email => {
      cy.get(`[data-testid='user-item-${email}']`).should('exist')
    })
  })

  it('calls the create task action when button is clicked', () => {
    mountComponent()
    cy.get('[data-testid="create-task-button"]').click()
    cy.get('[data-testid="task-form"]').should('be.visible')
  })

  it('should display the search filter from the Zustand store', () => {
    // 1. Set the Zustand store to a specific state for this test
    useTaskStore.setState({
      filter: {
        search: 'My Test Filter',
        user: undefined,
        priority: undefined,
        assigned_to_me: undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      },
    })

    // 2. Mount the component. It will now use the mocked store state.
    mountComponent()

    // 3. Assert that the component correctly reflects the store's state
    cy.get('input[placeholder="Search"]').should('have.value', 'My Test Filter')
  })
})

// We recommend installing an extension to run cypress tests.
