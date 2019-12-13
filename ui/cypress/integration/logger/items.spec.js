
before(() => {
    cy.login('admin@sapa.com', 'admin')
    cy.visit('http://localhost:3001')
})
describe('interaction with list items', () => {
    it('should allow user to add an item', () => {
        //wait for items to load
        cy.wait(1000);
        cy.get('[id="add-experience-button"]').click();
    
        cy.get('[id="item-0"]').should('exist');

        cy.get('[id="item-0-name-input"]').should('be.visible');
        cy.get('[id="item-0-description-input"]').should('be.visible');
        cy.get('[id="item-0-date-created"]').should('be.visible');
        cy.get('[id="item-0-time-created"]').should('be.visible');

        cy.get('[id="item-0-status-indicator"]').should('be.visible');


        cy.get('[id="item-0-delete-button"]').should('be.visible');
        cy.get('[id="item-0-save-button"]').should('be.visible');
        cy.get('[id="item-0-cancel-button"]').as('cancel-button').should('be.visible');

        cy.get('@cancel-button').click();

        cy.get('[id="item-0-delete-button"]').should('be.visible');
        cy.get('[id="item-0-edit-button"]').as('cancel-button').should('be.visible');

    })
})