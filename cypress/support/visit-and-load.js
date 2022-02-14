Cypress.Commands.add('visitAndLoad', (...args) => {
    cy.visit(...args)
    cy.get('.selector-bar-item').should('exist')
})
