Cypress.Commands.add(
    'getSelectorValueLabelByContent',
    (selectorLabel, selectorValueLabel) => {
        return cy.get(`
            button
            > .label:contains("${selectorLabel}")
            + .value:contains("${selectorValueLabel}")
        `)
    }
)
