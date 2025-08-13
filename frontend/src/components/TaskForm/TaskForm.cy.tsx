import TaskForm, { type TaskFormProps } from './TaskForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import type { TaskFormValues } from '@/schemas/task'

const queryClient = new QueryClient()

describe('<TaskForm />', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/comments', { fixture: 'comments' }).as(
      'getComments',
    )

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

  const mountComponent = (props: Partial<TaskFormProps>) => {
    const onSubmit = cy.stub().as('onSubmit')
    const onMarkAsCompleted = cy.stub().as('onMarkAsCompleted')

    const { defaultValues, isPending = false, isEditMode } = props

    cy.mount(
      <QueryClientProvider client={queryClient}>
        <TaskForm
          defaultValues={defaultValues}
          isPending={isPending}
          isEditMode={isEditMode}
          onSubmit={onSubmit}
          onMarkAsCompleted={onMarkAsCompleted}
        />
      </QueryClientProvider>,
    )
  }

  it('renders with no default values', () => {
    mountComponent({})
    cy.get('[data-testid="task-form"]').should('exist')
    cy.get('input[name="title"]').should('exist')
    cy.get('textarea[name="description"]').should('exist')
  })

  it('renders with default values', () => {
    const defaultValues: TaskFormValues = {
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2024-06-10',
      priority: 'medium',
      assigned_to: 'admin@example.com',
    }
    mountComponent({ defaultValues })
    cy.get('input[name="title"]').should('have.value', 'Test Task')
    cy.get('textarea[name="description"]').should(
      'have.value',
      'Test Description',
    )
    cy.get('input[type="date"]').should('have.value', '2024-06-10')
  })

  it('should call the onSubmit', () => {
    const defaultValues: TaskFormValues = {
      title: 'Test Task',
      description: 'Test Description',
      due_date: '2024-06-10',
      priority: 'medium',
      assigned_to: 'admin@example.com',
    }
    mountComponent({ defaultValues })
    cy.get('input[name="title"]').should('have.value', 'Test Task')
    cy.get('textarea[name="description"]').should(
      'have.value',
      'Test Description',
    )
    cy.get('input[type="date"]').should('have.value', '2024-06-10')

    cy.get('input[name="title"]').type('Mock Test Task')
    cy.get('textarea[name="description"]').type('Lorem impus')

    cy.get('button[type="submit"').click()

    cy.get('@onSubmit').should('have.been.called.with', {
      title: 'Mock Test Task',
      description: 'Lorem impus',
      due_date: '2024-06-10',
      priority: 'medium',
      assigned_to: 'admin@example.com',
    })
  })

  it('calls onMarkAsCompleted when button is clicked in edit mode', () => {
    mountComponent({ isEditMode: true })
    cy.get('button')
      .contains(/mark as completed/i)
      .click()
    cy.get('@onMarkAsCompleted').should('have.been.called')
  })
})
