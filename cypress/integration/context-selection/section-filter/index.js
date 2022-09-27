import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('a data set but no org unit has been selected yet', () => {
    cy.visit('/#/?dataSetId=V8MHeZHIrcP&periodId=2021')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set but no period has been selected yet', () => {
    cy.visit('/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given(
    'a data set, org unit and period have been selected and the data set does not have sections',
    () => {
        cy.visit(
            '/#/?dataSetId=rsyjyJmYD4J&orgUnitId=ImspTQPwCqd&periodId=2021April'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit and period have been selected and the data set has a custom form',
    () => {
        cy.visit(
            '/#/?dataSetId=TuL8IOPzpHh&orgUnitId=ImspTQPwCqd&periodId=202112'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit and period have been selected and the data set has a tabbed sectioned form',
    () => {
        const selectedId = 'V8MHeZHIrcP'
        cy.fixture('context-selection/metadata-complete').then((metadata) => {
            const metadataWithPatchedTabbedTrue = {
                ...metadata,
                dataSets: metadata.dataSets.map((ds) => {
                    if (ds.id !== selectedId) {
                        return ds
                    }

                    return {
                        ...ds,
                        renderAsTabs: true,
                    }
                }),
            }

            cy.intercept('GET', /api[/][0-9]+[/]dataEntry[/]metadata/, {
                body: metadataWithPatchedTabbedTrue,
            }).as('selectableDataSetsRequest')

            const selectedDataSet = metadataWithPatchedTabbedTrue.dataSets.find(
                ({ id }) => id === selectedId
            )
            cy.wrap(selectedDataSet).as('selectedDataSet')

            cy.visitAndLoad(
                '/#/?dataSetId=V8MHeZHIrcP&orgUnitId=ImspTQPwCqd&periodId=2021'
            )
            cy.get('[data-test="data-set-selector"]').should('exist')
        })
    }
)

Given(
    'a data set, org unit and period have been selected and the data set has some sections',
    () => {
        cy.visit(
            '/#/?dataSetId=V8MHeZHIrcP&orgUnitId=O6uvpzGd5pu&periodId=2020'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit and period have been selected and the data set is of type default',
    () => {
        cy.visit(
            '/#/?dataSetId=rsyjyJmYD4J&orgUnitId=ImspTQPwCqd&periodId=2021April'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given('no data set has been selected yet', () => {
    cy.visit('/')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

When('the user selects a section', () => {
    cy.get('[data-test="section-filter-selector"]').click()
    cy.get('[data-test="menu-select"] li:nth-child(2) [data-value]').then(
        (el) => {
            const $el = Cypress.$(el)
            const id = $el.attr('data-value')
            const displayName = $el.text()
            cy.wrap({ id, displayName }).as('selectedOption')
        }
    )
    cy.get('[data-test="menu-select"] li:nth-child(2)').click()
})

Then('no "all sections" option should be available', () => {
    cy.contains('All sections').should('not.exist')
})

Then('that section should be selected', () => {
    cy.get('@selectedOption').then(({ displayName }) => {
        cy.get('[data-test="section-filter-selector"]')
            .contains(displayName)
            .should('exist')
    })
})

Then('the "all sections" option should be selected', () => {
    cy.get('[data-test="section-filter-selector"]')
        .contains('All sections')
        .should('exist')
})

Then('the first section should be selected by default', () => {
    // open
    cy.get('[data-test="section-filter-selector"]').click()
    // there should be no "show all" option
    cy.contains('All sections').should('not.exist')
    // get the first option's text
    cy.get('[data-test="menu-select"] li:nth-child(1)')
        .invoke('text')
        .then((optionLabel) => {
            // The selector should have that label
            // As the menu is rendered in a portal,
            // this selector wouldn't yield any element
            // if the option hasn't been selected
            cy.get('[data-test="section-filter-selector"]')
                .contains(optionLabel)
                .should('exist')
        })
})

Then('the section filter selector should be displayed', () => {
    cy.get('[data-test="section-filter-selector"]').should('exist')
})

Then('the section filter selector should not be displayed', () => {
    cy.get('[data-test="section-filter-selector"]').should('not.exist')
})

Then('the section id should be reflected in the url', () => {
    cy.get('@selectedOption').then(({ id }) => {
        cy.url().should('match', new RegExp(`sectionFilter=${id}`))
    })
})
