/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("displays btn", () => {
    cy.get('[data-cy="settings-button"]').should("be.visible");
  });

  it("shows tooltip on hover", () => {
    cy.get('[data-cy="settings-button"]').trigger("mouseover");
    cy.get('[data-cy="settings-button-tooltip"]').should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="preset-config-open-popup"]').should("be.visible");
    cy.get('[data-cy="load-channel-config"]').should("be.visible");
    cy.get('[data-cy="available-presets-list"]').should("be.visible");
    cy.get('[data-cy="selected-preset"]').should("be.visible");
    cy.get('[data-cy="store-channel-config"]').should("be.visible");
  });

  it("closes popup on click outside", () => {
    cy.get('[data-cy="settings-button"]').click();
    cy.get('[data-cy="preset-config-open-popup"]').should("be.visible");
    cy.get('[data-cy="oscilloscope"]').click();
    cy.get('[data-cy="preset-config-open-popup"]').should("not.be.visible");
  });
});
