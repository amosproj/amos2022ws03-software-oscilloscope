/// <reference types="cypress" />

describe('everything visible on front page', () => {
  beforeEach(() => {
    // Go to the website
    cy.visit('http://localhost:5173/')
  })

  it('displays logo', () => {
    cy.get('.canvas').should('be.visible')
    // We use the `cy.get()` to get the logo element
    cy.get('[data-cy="logo"]').should('be.visible')
  })

  it('canvas', () => {
    // We use the `cy.get()` to get the canvas element
    cy.get('[data-cy="oscilloscope"]')
  })

})
