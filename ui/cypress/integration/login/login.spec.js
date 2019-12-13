before(() => {
    cy.get('[id="logout-button"]').click();
    cy.visit('http://localhost:3001')
})

describe('User should be able to log into the UI', () => {
    it('should contain a login button', () => {
        cy.get('[id="login-button"]').should('be.visible').as('loginbutton');
        cy.get('[id="signup-button"]').should('be.visible');
        cy.get('@loginbutton').click();
        cy.get('[id="popover-container"]').should('be.visible');
        cy.get('[id="login-email-input"]').should('be.visible').as('email');
        cy.get('[id="login-pw-input"]').should('be.visible').as('password');

    })

    it('should handle login errors', () => {
        cy.get('[id="login-email-input"]').as('email');
        cy.get('[id="login-pw-input"]').as('password');

        cy.get('@email').type('test@test.com').should('have.value', 'test@test.com').clear();
        cy.get('@password').type('password123').should('have.value', 'password123').clear();

        // check that invalid user error is displayed
        cy.get('@email').type('test@test.com');
        cy.get('@password').type('password123');
        cy.get('[id="submit-login"]').click();
        cy.get('[id="login-errors"]').should('contain', "The requested resource does not exist");
        cy.get('@password').clear();

        // check with valid user, but no password
        cy.get('@email').clear().type('admin@sapa.com');
        cy.get('[id="submit-login"]').click();
        cy.get('[id="login-errors"]').should('contain', "Invalid password");
        
    });

    it('should login with correct user', () => {
        cy.get('[id="login-email-input"]').as('email');
        cy.get('[id="login-pw-input"]').as('password');

        cy.get('@email').clear().type('admin@sapa.com');
        cy.get('@password').clear().type('admin');

        cy.get('[id="submit-login"]').click();
        cy.get('[id="logout-button"]').should('be.visible');
    });
})