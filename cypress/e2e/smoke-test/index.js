import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('the user opens the app', () => {
    cy.visit('/')
})

Then('it should load without crashing', () => {
    cy.get('#dhis2-app-root').should('exist')
})
