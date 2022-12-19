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
    cy.get(`[data-cy="timesweepSlider-0"]`).within(() => {
      cy.get('[type="range"]').invoke("val", 2).trigger("change");
      cy.get('[type="range"]').invoke("val", 7).trigger("change");
    });
  });
});
