describe("timesweepSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="timesweepSlider-${i}"]`).should("be.visible");
    });
  });

  it("change value", () => {
    cy.get(":nth-child(1) > #btn-on-off").click();
    cy.wait(2000);
    cy.get('[data-cy="timesweepSlider-0"]').invoke("val", 2).trigger("change");
    cy.get('[data-cy="timesweepSlider-1"]').invoke("val", 7).trigger("change");
  });
});
