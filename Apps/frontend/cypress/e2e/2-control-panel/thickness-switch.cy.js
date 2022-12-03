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

  it("toggle switch", () => {
    cy.get(`[data-cy="thicknessSwitch-0"]`).within(() => {
      cy.get('[type="checkbox"]').check({ force: true }).should("be.checked");
      cy.get('[type="checkbox"]').click().should("not.be.checked");
    });
  });
});
