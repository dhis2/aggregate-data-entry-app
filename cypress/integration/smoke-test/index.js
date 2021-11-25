import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('the user opens the app', () => {
    cy.visit('/')
})

Then('it should load without crashing', () => {
    cy.get('#dhis2-app-root').should('exist')
})
