/// <reference types="cypress" />

describe("expandAccordion", () => {
  beforeEach(() => {
    // Go to the website
    cy.visit("http://localhost:5173/");
    cy.viewport(800, 400);
  });

  it("is visible", () => {
    cy.get('[data-cy="expand-accordion"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="expand-accordion"]').click();
  });

  it("is closable with X-button", () => {
    cy.get('[data-cy="expand-accordion"]').click();
    cy.get('[data-cy="expanded-control-panel-close-button"]').click();
  });

  it("is closeable with outside click", () => {
    cy.get('[data-cy="expand-accordion"]').click();
    cy.get("body").not('[data-cy="expanded-control-panel"]').click();
  });
});
