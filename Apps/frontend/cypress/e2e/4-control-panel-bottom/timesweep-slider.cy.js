describe("timesweepSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="timesweepSlider-${i}"]`).should("be.visible");
    });
  });

  it("changes value", () => {
    cy.get(`[data-cy="timesweepSlider-0"]`)
      .find('[type="range"]')
      .invoke("val", 9)
      .trigger("change");
  });

  it("respects range", () => {
    cy.get('[data-cy="timesweepSlider-0"]')
      .find('[type="range"]')
      .invoke("val", -2)
      .trigger("change")
      .should("have.value", 0);
    cy.get('[data-cy="timesweepSlider-1"]')
      .find('[type="range"]')
      .invoke("val", 20)
      .trigger("change")
      .should("have.value", 10);
  });
});
