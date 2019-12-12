

before(() => {
    cy.login('martinbrandt@gmail.com', 'hahahahaa')
    cy.visit('http://localhost:3001')
})

describe('testing the filter component within the logger', () => {
    it('should exist', () => {
        cy.get('[id="filter-component"]').should('be.visible')
        
        cy.get('[id="filter-enddate"]').should('be.visible')
        
        cy.get('[id="filter-startdate"]').should('be.visible')
        cy.get('[id="filter-endtime"]').should('be.visible')
        cy.get('[id="filter-starttime"]').should('be.visible')

        cy.get('[id="filter-submit"]').should('be.visible')
        cy.get('[id="filter-clear"]').should('be.visible')
    })

    it('should show error for improper date', () => {
        
        cy.get('[id="filter-enddate"]').clear()
        cy.get('[id="enddate-err').should('be.visible')

        cy.get('[id="filter-startdate"]').clear()
        cy.get('[id="startdate-err').should('be.visible')

        cy.get('[id="filter-startdate"]').clear().type('2020-0-0')
        cy.get('[id="startdate-err').should('be.visible')
        
        cy.get('[id="filter-startdate"]').clear().type('2020-01-01')
        cy.get('[id="startdate-err').should('be.hidden')

        cy.get('[id="filter-starttime"]').clear()
        cy.get('[id="starttime-err').should('be.visible')

        cy.get('[id="filter-starttime"]').clear().type("1:2:3")
        cy.get('[id="starttime-err"]').should('be.visible')

        // validates with correct time
        cy.get('[id="filter-starttime"]').clear().type("01:02:03")
        cy.get('[id="starttime-err"]').should('be.hidden')

        cy.get('[id="filter-endtime"]').clear()
        cy.get('[id="endtime-err"]').should('be.visible')

        cy.get('[id="filter-endtime"]').clear().type("1:2:3")
        cy.get('[id="endtime-err"]').should('be.visible')
    });

    it('should clear filter and restore original values on click', () => {
        cy.get('[id="filter-clear"]').click();

        cy.get('[id="startdate-err').should('be.hidden')
        cy.get('[id="enddate-err').should('be.hidden')
        cy.get('[id="starttime-err').should('be.hidden')
        cy.get('[id="endtime-err').should('be.hidden')

    });



})