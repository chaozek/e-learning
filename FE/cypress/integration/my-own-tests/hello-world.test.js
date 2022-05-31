/// <reference types="cypress" />;

describe("Basic test", () => {
  it("We have correct Title", () => {
    cy.viewport("ipad-2");
    cy.visit("https://codedamn.com/")
      .get("[data-bypassmenuclose]")
      .click()
      .get(".space-y-1 > a")
      .last()
      .click();
  });
});
