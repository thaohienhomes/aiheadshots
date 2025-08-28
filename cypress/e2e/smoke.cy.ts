describe('Smoke: app boots and renders homepage', () => {
  it('loads homepage and shows key UI', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    // Look for any of these common texts to avoid brittleness across copy tweaks
    cy.contains(/Try Now|Sample Results|AI Model|Get Started/i, { timeout: 10000 }).should('exist');
  });
});

