import { useTaskStore } from '@/store/taskStore'
import TaskListBody from './TaskListBody'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'

const queryClient = new QueryClient()

describe('<TaskListBody />', () => {
  beforeEach(() => {
    cy.window().then(win => {
      win.useTaskStore = useTaskStore
      useTaskStore.setState(useTaskStore.getInitialState())
    })

    cy.window().then(win => {
      win.useAuthStore = useAuthStore
      useAuthStore.setState(useAuthStore.getInitialState())
    })

    cy.intercept('GET', '**/tasks*', { fixture: 'task-response' }).as(
      'getTasks',
    )

    cy.fixture('tasks').as('tasks')
  })

  const mountComponent = () => {
    const onDeleteTask = cy.stub().as('onDeleteTask')

    cy.get('@tasks').then(tasks => {
      cy.mount(
        <QueryClientProvider client={queryClient}>
          <TaskListBody tasks={tasks} onDeleteTask={onDeleteTask} />
        </QueryClientProvider>,
      )
    })
  }

  it('render', () => {
    mountComponent()
    cy.get('[data-testid="task-list-body"]').should('exist')
  })

  it('should render the objects', () => {
    mountComponent()

    cy.get('@tasks').then(tasks => {
      cy.get('[data-testid="task-list-body"] li').should(
        'have.length',
        tasks.length,
      )

      tasks.forEach(task => {
        cy.contains('li', task.title)
          .should('be.visible')
          .within(() => {
            cy.contains(/Due to/)

            if (task.completed) {
              cy.contains(/Completed/)
            }
          })
      })
    })
  })
})
