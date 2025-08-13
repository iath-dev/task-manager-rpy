import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { TaskList } from './TaskList'
import { useTaskStore } from '@/store/taskStore'

const queryClient = new QueryClient()

describe('<TaskList />', () => {
  beforeEach(() => {
    const setEditingTask = cy.stub().as('setEditingTask')

    cy.window().then(win => {
      win.useTaskStore = useTaskStore
      useTaskStore.setState({
        ...useTaskStore.getInitialState(),
        setEditingTask,
      })
    })

    cy.intercept('GET', '**/tasks*', { fixture: 'task-response' }).as(
      'getTasks',
    )

    cy.intercept('DELETE', '**/tasks/*').as('deleteTask')

    cy.fixture('tasks').as('tasks')
  })

  const mountComponent = () => {
    cy.viewport('macbook-15')

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>,
    )
  }

  it('render', () => {
    mountComponent()
    cy.get('[data-testid="task-list-card"]').should('exist')
  })

  it('should call delete', () => {
    mountComponent()

    cy.get('@tasks').then(tasks => {
      const task = tasks[0]

      cy.get(`[data-testid='task-list-${task.id}']`).should('exist')
      cy.get(
        `[data-testid='task-list-${task.id}'] [data-testid="task-item-delete"]`,
      ).click()

      cy.wait('@deleteTask')

      cy.get('@deleteTask').its('request.method').should('eq', 'DELETE')
    })
  })

  it('should call edit', () => {
    mountComponent()

    cy.get('@tasks').then(tasks => {
      const task = tasks[0]

      cy.get(`[data-testid='task-list-${task.id}']`).should('exist')
      cy.get(
        `[data-testid='task-list-${task.id}'] [data-testid="task-item-edit"]`,
      ).click()

      cy.get('@setEditingTask').should('have.been.calledWithMatch', {
        id: task.id,
      })
    })
  })
})
