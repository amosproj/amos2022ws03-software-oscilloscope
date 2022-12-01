/// <reference types="cypress" />

describe("thicknessToggle", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get('[data-cy="thicknessToggle-' + i + '"]').should("be.visible");
    });
  });

  it("toggle", () => {
    cy.get('[data-cy="thicknessToggle-0"]').click();
  });
});
