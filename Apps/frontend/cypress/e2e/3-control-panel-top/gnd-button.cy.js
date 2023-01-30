/// <reference types="cypress" />

describe("gndButton", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/", {});
  });

  it("is visible", () => {
    cy.get(".control-panel--top_general").should("be.visible");
    cy.get('[data-cy="gnd-button"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="gnd-button"]').click();
  });

  it("shows tooltip on hover", () => {
    cy.get('[data-cy="gnd-button"]').trigger("mouseover");
    cy.get('[data-cy="gnd-button-tooltip"]').should("be.visible");
  });
  // Stub is not working in the e2e test, createEventDispatcher still
  // returns the svelte dispatch fn.
  // it("handles click", () => {
  // const dispatch = cy.spy().as("dispatch");
  // cy.stub(svelte, "createEventDispatcher").returns(dispatch);
  // cy.get('[data-cy="gnd-button"]').click();
  // cy.get("@dispatch").should("be.called");
  // });
});
