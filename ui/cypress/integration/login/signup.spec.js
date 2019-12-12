before(() => {
    cy.visit('http://localhost:3001')
})

describe('User should be able to create a new account', () => {
    it('should contain a sign up page', () => {
        cy.get('[id="signup-button"]').click();
        cy.get('[id="signup-component"]').should('be.visible');


        cy.get('[id="signup-email-input"]').should('be.visible');
        cy.get('[id="signup-pw-input"]').should('be.visible');
        cy.get('[id="signup-name-input"]').should('be.visible');

        cy.get('[id="signup-submit-button"]').should('be.visible');
        cy.get('[id="signup-cancel-button"]').should('be.visible');

    })
    it('should handle errors correctly', () => {
        //should probably complain or something
        cy.get('[id="signup-submit-button"]').click();

        // can't submit with invalid email
        cy.get('[id="signup-email-input"]').type('test');
        cy.get('[id="signup-submit-button"]').click();
        cy.get('[id="user-created-success"]').should('not.exist')

        // fails without username
        cy.get('[id="signup-email-input"]').clear().type('test@test.com');
        cy.get('[id="signup-submit-button"]').click();
        cy.get('[id="signup-error"]').should('contain', 'A user name must be provided')

        // fails without password
        cy.get('[id="signup-email-input"]').clear().type('test@test.com');
        cy.get('[id="signup-name-input"]').clear().type('test testerson');
        cy.get('[id="signup-submit-button"]').click();
        cy.get('[id="signup-error"]').should('contain', 'A user password must be provided')

    
    });
    
})