/// <reference types="cypress" />

describe("onOffButton", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    cy.get(".control-panel--top_general").should("be.visible");
    cy.get('[data-cy="on-off-button"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="on-off-button"]').click();
    cy.get('[data-cy="on-off-button"]').should("have.class", "icon--off");
  });

  it("shows tooltip on hover", () => {
    cy.get('[data-cy="on-off-button"]').trigger("mouseover");
    cy.get('[data-cy="on-off-button-tooltip"]').should("be.visible");
  });
});
