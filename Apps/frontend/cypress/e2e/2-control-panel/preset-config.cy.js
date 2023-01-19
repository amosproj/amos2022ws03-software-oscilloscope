/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("displays btn", () => {
    cy.get("#settingsButton").should("be.visible");
  });

  it("is clickable", () => {
    cy.get('[data-cy="preset-config-open-popup"]').click();
    cy.get("#getChannelConfig").should("be.visible");
    cy.get("#availablePreset").should("be.visible");
    cy.get("#presetName").should("be.visible");
    cy.get("#storeChannelConfig").should("be.visible");
    cy.get("#cancelChannelConfig").should("be.visible");
  });
});
