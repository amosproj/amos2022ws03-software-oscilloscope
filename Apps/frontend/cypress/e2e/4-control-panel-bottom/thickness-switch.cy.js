/// <reference types="cypress" />

describe("thicknessSwitch", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="thicknessSwitch-${i}"]`).should("be.visible");
    });
  });

  it("toggles switch", () => {
    cy.get(`[data-cy="thicknessSwitch-0"]`).within(() => {
      cy.get('[role="switch"]').should("have.attr", "aria-checked", "false");
      cy.get('[role="switch"]')
        .click()
        .should("have.attr", "aria-checked", "true");
    });
  });
});
