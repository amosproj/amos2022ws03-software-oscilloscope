describe("LineIndicators", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("is visible", () => {
    cy.get('[data-cy="line-indicators"]').should("be.visible");
  });
});

describe("TextIndicators", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("are visible", () => {
    cy.get('[data-cy="text-indicators"]').should("be.visible");
  });

  it("have correct colors", () => {
    let expectedColors = [
      "rgb(230, 0, 73)",
      "rgb(11, 180, 255)",
      "rgb(80, 233, 145)",
      "rgb(230, 216, 0)",
      "rgb(155, 25, 245)",
      "rgb(255, 163, 0)",
      "rgb(220, 10, 180)",
      "rgb(179, 212, 255)",
      "rgb(0, 191, 160)",
      "rgb(128, 143, 128)",
    ];
    cy.get('[data-cy="text-indicators"]')
      .find("tr")
      .each((tr, i) => {
        cy.wrap(tr).should("have.css", "color").and("equal", expectedColors[i]);
      });
  });
});
