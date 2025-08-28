describe('AI Models Showcase UX', () => {
  it.skip('supports keyboard navigation on model tabs', () => {
    cy.visit('/');
    cy.get('[data-testid="model-tab-flux-pro-ultra"]').focus();
    cy.focused().type('{rightarrow}');
    cy.focused().should('have.attr', 'aria-selected', 'true');
    cy.focused().type('{leftarrow}');
    cy.focused().should('have.attr', 'aria-selected', 'true');
  });

  it.skip('Try Now navigates and preselects model in style selection', () => {
    cy.visit('/');
    cy.get('[data-testid="model-tab-imagen4"]').click();
    cy.get('[data-testid="try-now"]').click();
  });

  it.skip('opens zoom dialog for a sample and closes via ESC', () => {
    cy.visit('/');
  });
});
