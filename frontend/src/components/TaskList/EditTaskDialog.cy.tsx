import { useTaskStore } from '@/store/taskStore'
import EditTaskDialog from './EditTaskDialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

describe('<EditTaskDialog />', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    cy.fixture('task').then(task => {
      const setEditingTask = cy.stub().as('setEditingTask')

      cy.window().then(win => {
        win.useTaskStore = useTaskStore
        useTaskStore.setState({
          ...useTaskStore.getInitialState(),
          editingTask: task,
          setEditingTask,
        })
      })
    })

    // Set up common API intercepts
    cy.intercept('GET', '**/comments', { fixture: 'comments' }).as(
      'getComments',
    )
    cy.intercept('GET', '**/users/emails', { fixture: 'users-emails' }).as(
      'getUsers',
    )
    cy.intercept('POST', '**/tasks/**').as('postTask')
  })

  const mountComponent = () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <EditTaskDialog />
      </QueryClientProvider>,
    )
  }

  it('renders macbook view', () => {
    cy.viewport('macbook-15')
    // see: https://on.cypress.io/mounting-react
    mountComponent()

    cy.get('[data-testid="task-form"').should('exist')
  })

  it('renders mobile', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent()

    cy.get('[data-testid="task-form"').should('exist')
    cy.get('[data-testid="edit-dialog-cancel"]').click()

    cy.get('@setEditingTask').should('have.been.called')
  })
})
