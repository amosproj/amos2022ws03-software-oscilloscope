/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    // Go to the website
    cy.visit("http://localhost:5173/");
  });

  it("layout visible", () => {
    cy.get('[data-cy="oscilloscope"]').should("be.visible");
  });

  it("screen not landscaoe", () => {
    cy.viewport(550, 750);
    cy.get(".screen-size-warning").should("be.visible");
  });

  it("screen landscape", () => {
    cy.viewport(900, 750);
    cy.get(".wrapper").should("be.visible");
  });
});
