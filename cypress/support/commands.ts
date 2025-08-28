/// <reference types="cypress" />

// Define no-op custom commands to satisfy imports if present in specs.
// Extend as needed with real implementations.

Cypress.Commands.add('login', (email: string, password: string) => {
  // Implement login flow here if required by tests
});

Cypress.Commands.add('signUp', (email: string, password: string) => {
  // Implement sign up flow here if required by tests
});

Cypress.Commands.add('generateRandomEmail', () => {
  const ts = Date.now();
  return `${ts}@example.com`;
});

export {};

