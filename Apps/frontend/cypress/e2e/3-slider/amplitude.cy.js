describe("amplitudeSlider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    cy.get('[data-cy="amplitudeSlider-0"]');
    cy.get('[data-cy="amplitudeSlider-1"]');
    cy.get('[data-cy="amplitudeSlider-2"]');
    cy.get('[data-cy="amplitudeSlider-3"]');
    cy.get('[data-cy="amplitudeSlider-4"]');
    cy.get('[data-cy="amplitudeSlider-5"]');
    cy.get('[data-cy="amplitudeSlider-6"]');
    cy.get('[data-cy="amplitudeSlider-7"]');
    cy.get('[data-cy="amplitudeSlider-8"]');
    cy.get('[data-cy="amplitudeSlider-9"]');
  });

  it("change value", () => {
    cy.get(":nth-child(1) > #btn-on-off").click();
    cy.wait(2000);
    cy.get('[data-cy="amplitudeSlider-0"]').invoke("val", 2).trigger("change");
    cy.get('[data-cy="amplitudeSlider-1"]')
      .invoke("val", 0.5)
      .trigger("change");
  });
});
