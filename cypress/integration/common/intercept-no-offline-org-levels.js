import { Before } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    // When this is not done, the cypress:run:stubs command fails on CI for
    // some reason. So instead, we just overwrite whatever comes from the api,
    // do not preload any org unit and test this explicitly in its own test
    cy.intercept('GET', /filledOrganisationUnitLevels/, [])
})
