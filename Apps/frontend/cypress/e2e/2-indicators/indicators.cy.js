describe("indicators", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    cy.get('[data-cy="indicators"]');
  });

  it("is displayed correctly initially", () => {
    cy.get('[data-cy="indicators"]').compareSnapshot("initial");
  });
});
