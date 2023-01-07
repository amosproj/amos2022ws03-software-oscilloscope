/// <reference types="cypress" />

describe("resetButton", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    cy.get(".control-panel--top_general").should("be.visible");
    cy.get('[data-cy="reset-button"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="reset-button"]').click();
  });
});
