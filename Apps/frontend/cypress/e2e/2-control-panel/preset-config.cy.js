/// <reference types="cypress" />

describe("everything visible on front page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("displays btn", () => {
    cy.get("#getChannelConfig").should("be.visible");
    cy.get("#storeChannelConfig").should("be.visible");
  });
});
