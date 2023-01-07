/// <reference types="cypress" />

describe("expandAccordion", () => {
  beforeEach(() => {
    // Go to the website
    cy.visit("http://localhost:5173/");
    cy.viewport(800, 400);
  });

  it("is visible", () => {
    cy.get('[data-cy="expand-accordion"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="expand-accordion"]').click();
  });
});
