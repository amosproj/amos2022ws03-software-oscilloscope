/// <reference types="cypress" />

describe("startStopSwitch", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="startStopSwitch-${i}"]`).should("be.visible");
    });
  });

  it("toggle switch", () => {
    cy.get(`[data-cy="startStopSwitch-0"]`).within(() => {
      cy.get('[role="switch"]').should("have.attr", "aria-checked", "false");
      cy.get('[role="switch"]')
        .click()
        .should("have.attr", "aria-checked", "true");
    });
  });
});
