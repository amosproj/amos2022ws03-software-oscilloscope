/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("displays btn", () => {
    cy.get(".control-panel").should("be.visible");
    cy.get(".btn-reset").should("be.visible");
  });

  it("click btn", () => {
    // We use the `cy.get()` to get the canvas element
    cy.get("#btn-reset").click();
  });
});
