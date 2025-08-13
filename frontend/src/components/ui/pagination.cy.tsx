import React from 'react'
import Pagination, { type PaginationProps } from './pagination'

describe('<Pagination />', () => {
  const mountComponent = (
    props: Pick<
      PaginationProps,
      'page' | 'pageSize' | 'pageSizeOptions' | 'totalPages'
    >,
  ) => {
    const onPageChange = cy.stub().as('onPageChange')
    const onPageSizeChange = cy.stub().as('onPageSizeChange')

    cy.mount(
      <Pagination
        {...props}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )
  }

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 1, pageSize: '10', totalPages: 5 })

    cy.contains(/Page 1 of 5/)
  })

  it('prev should be disabled', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 1, pageSize: '10', totalPages: 5 })

    cy.get('[data-testid="pagination-prev"]').should('be.disabled')
  })

  it('call change prev page', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 1, pageSize: '10', totalPages: 5 })

    cy.get('[data-testid="pagination-next"]').click()

    cy.get('@onPageChange').should('been.calledWith', 2)
  })

  it('next should be disabled', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 5, pageSize: '10', totalPages: 5 })

    cy.get('[data-testid="pagination-next"]').should('be.disabled')
  })

  it('call change next page', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 2, pageSize: '10', totalPages: 5 })

    cy.get('[data-testid="pagination-prev"]').click()

    cy.get('@onPageChange').should('been.calledWith', 1)
  })

  it('change page size', () => {
    // see: https://on.cypress.io/mounting-react
    mountComponent({ page: 2, pageSize: '10', totalPages: 5 })

    cy.get('[data-testid="pagination-size-trigger"]').click()

    cy.get('[data-testid="page-size-5"]').click()

    cy.get('@onPageSizeChange').should('been.calledWith', '5')
  })
})
