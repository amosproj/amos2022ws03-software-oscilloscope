describe("offsetSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="offsetSlider-${i}"]`).should("be.visible");
    });
  });

  it("changes value", () => {
    cy.get(`[data-cy="offsetSlider-0"]`)
      .find('[type="range"]')
      .invoke("val", 0.52)
      .trigger("change");
    cy.get('[data-cy="offsetSlider-1"]')
      .find('[type="range"]')
      .invoke("val", -0.7)
      .trigger("change");
  });
});
