import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CommentList from './CommentsList'
import { useTaskStore } from '@/store/taskStore'

const queryClient = new QueryClient()

describe('<CommentList />', () => {
  beforeEach(() => {
    cy.fixture('task').then(task => {
      cy.window().then(win => {
        win.useTaskStore = useTaskStore
        useTaskStore.setState({
          ...useTaskStore.getInitialState(),
          editingTask: task,
        })
      })
    })

    cy.intercept('GET', '**/comments', { fixture: 'comments' }).as(
      'getComments',
    )

    cy.intercept('POST', '**/comments').as('postComment')
  })

  const mountComponent = () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <CommentList />
      </QueryClientProvider>,
    )
  }

  it('renders', () => {
    mountComponent()

    cy.get('[data-testid="comments-list"]').should('exist')
  })

  it('should render comments', () => {
    mountComponent()

    cy.wait('@getComments', { timeout: 10000 }).then(interception => {
      const comments = interception.response.body
      // Puedes hacer assertions o usarlo como quieras
      expect(comments).to.have.length.greaterThan(0)
      // O usarlo en otros comandos
      cy.wrap(comments).as('commentsData')
    })

    cy.get('@commentsData').then(comments => {
      comments.forEach(comment => {
        cy.get(`[data-testid="comment-${comment.id}"]`).should('exist')

        cy.get(`[data-testid="comment-${comment.id}"]`)
          .get(`[data-testid="comment-${comment.id}-content"]`)
          .should('have.text', comment.content)
      })
    })
  })

  it('should call post mutation', () => {
    mountComponent()

    cy.get('input[name="comment"]').type('hello world')
    cy.get('form').submit()

    cy.wait('@postComment').its('request.body').should('exist')
    // También puedes verificar los datos enviados:
    cy.wait('@postComment').then(interception => {
      expect(interception.request.body.content).to.equal('hello world')
    })
  })
})
