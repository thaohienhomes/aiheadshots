declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    signUp(email: string, password: string): Chainable<void>
    generateRandomEmail(): Chainable<string>
  }
}

