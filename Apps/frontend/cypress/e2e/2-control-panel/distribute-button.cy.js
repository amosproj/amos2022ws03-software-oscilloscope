/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("click distribute wave button", () => {
    // We use the `cy.get()` to get the canvas element
    cy.get("#distribute-button").click();
  });
});
