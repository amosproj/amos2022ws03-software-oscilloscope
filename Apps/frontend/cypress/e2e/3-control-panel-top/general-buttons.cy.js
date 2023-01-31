/// <reference types="cypress" />

describe("GeneralButtons", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("resets on off button when reset button is clicked", () => {
    cy.get('[data-cy="on-off-button"]').click();
    cy.get('[data-cy="reset-button"]').click();
    cy.get('[data-cy="on-off-button"]').should("have.class", "icon--on");
  });
});
