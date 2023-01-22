describe("amplitudeSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get(`[data-cy="amplitudeSlider-${i}"]`).should("be.visible");
    });
  });

  it(`has label that displays reciprocal value "Infinity"`, () => {
    cy.get(`[data-cy="amplitudeSlider-0"]`).within(() => {
      cy.get('[type="range"]').invoke("val", 2).trigger("change");
      cy.get("div").should("have.text", "0.50");
    });
  });

  it(`has label that displays reciprocal value "Infinity" for value 0`, () => {
    cy.get(`[data-cy="amplitudeSlider-1"]`).within(() => {
      cy.get('[type="range"]').invoke("val", 0).trigger("change");
      cy.get("div").should("have.text", "Infinity");
    });
  });

  it("respects range", () => {
    cy.get('[data-cy="amplitudeSlider-0"]')
      .find('[type="range"]')
      .invoke("val", -2)
      .trigger("change")
      .should("have.value", 0);
    cy.get('[data-cy="amplitudeSlider-1"]')
      .find('[type="range"]')
      .invoke("val", 20)
      .trigger("change")
      .should("have.value", 5);
  });
});
