describe("amplitudeSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    Cypress._.times(10, (i) => {
      cy.get('[data-cy="amplitudeSlider-' + i + '"]').should("be.visible");
    });
  });

  it("change value", () => {
    cy.get(`[data-cy="amplitudeSlider-0"]`).within(() => {
      cy.get('[type="range"]').invoke("val", 2).trigger("change");
      cy.get("span").should("have.text", "0.50");
    });
  });

  it("change value to 0", () => {
    cy.get(`[data-cy="amplitudeSlider-1"]`).within(() => {
      cy.get('[type="range"]').invoke("val", 0).trigger("change");
      cy.get("span").should("have.text", "Infinity");
    });
  });
});
