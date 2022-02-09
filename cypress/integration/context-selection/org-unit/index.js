import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const getOrgUnitSelectorValueLabelByContent = (selectorValueLabel) => {
    return cy.getSelectorValueLabelByContent(
        'Organisation unit',
        selectorValueLabel
    )
}

Given('no data set has been selected', () => {
    cy.visit('/')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set has been selected', () => {
    cy.visit('/#/?dataSetId=lyLU2wR22tC')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set and an org unit have been selected', () => {
    cy.visit(`/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given(
    "a data set and an org unit have been selected but loading the org unit's data will fail",
    () => {
        cy.intercept(
            'GET',
            new RegExp(
                `organisationUnits/ImspTQPwCqd[?]fields=id,displayName,path$`
            ),
            { statusCode: 404, body: '404 Not Found!' }
        )

        cy.visit('/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd')
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

When('the user hovers the org unit selector', () => {
    cy.get('[data-test="org-unit-selector"] button > .label').trigger(
        'mouseover'
    )
})

Then(
    'a tooltip with the content "Choose a data set first" should be shown',
    () => {
        cy.contains('Choose a data set first').should('exist')
    }
)

Then('a no-value-label should be displayed', () => {
    cy.contains('Choose a organisation unit').should('exist')
})

Then('a loading message should be displayed while loading its data', () => {
    cy.contains('Fetching organisation unit info').should('exist')
})

Then('its value-label should be displayed', () => {
    getOrgUnitSelectorValueLabelByContent('Sierra Leone').should('exist')
})

Then('an error message should be displayed', () => {
    cy.contains('Error occurred while loading organisation unit info').should(
        'exist'
    )
})

When('the user opens the org unit selector', () => {
    // @TODO: Wait for this otherwise the org unit tree throws
    // "called" is not being checked by the tree, needs fix
    cy.contains('Choose a organisation unit').should('exist')

    cy.get('[data-test="org-unit-selector"] button').click()
})

When('the root org unit have been loaded', () => {
    cy.get(
        `[data-test="org-unit-selector-tree"] :contains("Sierra Leone")`
    ).should('exist')
})

When('selects an org unit', () => {
    cy.get(
        `[data-test="org-unit-selector-tree-node-label"]:contains("Sierra Leone")`
    ).click()
})

Then(
    "the org unit's display name should be displayed as selected value",
    () => {
        getOrgUnitSelectorValueLabelByContent('Sierra Leone').should('exist')
    }
)

Then("the org unit's id should be persisted", () => {
    cy.url().should('match', new RegExp(`orgUnitId=ImspTQPwCqd`))
})

When(
    'the user filters the org units by the name of a non-root org unit',
    () => {
        cy.get('#context-selection-org-unit-search').type('Bombali')
        // wait for debounced value
        cy.wait(200) // eslint-disable-line cypress/no-unnecessary-waiting
    }
)

Then(
    'the org unit tree should only display nodes up until the filtered org unit',
    () => {
        // Open Sierra Leone
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains("Sierra Leone")`
        )
            .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
            .find('[data-test="org-unit-selector-tree-node-toggle"]')
            .click()

        // Wait until bombali loaded its data
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains("Bombali")`
        )
            .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
            .first() // Ignore the node of Sierra Leone
            .find('[data-test="org-unit-selector-tree-node-toggle"]')
            .should('exist')

        // Open Bombali
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains("Bombali")`
        )
            .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
            .first() // Ignore the node of Sierra Leone
            .find('[data-test="org-unit-selector-tree-node-toggle"]')
            .click()

        // Wait until bombali sebora loaded its data
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains("Bombali Sebora")`
        )
            .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
            .first() // Ignore the node of Sierra Leone and Bombali
            .find('[data-test="org-unit-selector-tree-node-icon"]')
            .should('not.exist')

        // "Bombali Sebora" should not have children
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains("Bombali Sebora")`
        )
            .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
            .first() // Ignore the node of Sierra Leone and Bombali
            .find('[data-test="org-unit-selector-tree-node-toggle"]')
            .should('not.exist')

        // There should be exactly three nodes
        cy.get('[data-test="org-unit-selector-tree-node"]').should(
            'have.length',
            3
        )
    }
)

When('the user expands the root org unit', () => {
    cy.get(
        `[data-test="org-unit-selector-tree-node-label"]:contains("Sierra Leone")`
    )
        .invoke('parents', '[data-test="org-unit-selector-tree-node"]')
        .find('[data-test="org-unit-selector-tree-node-toggle"]')
        .click()
})

Then("the root org unit's children should be displayed", () => {
    cy.get(
        `
                [data-test="org-unit-selector-tree-node-label"]:contains("Sierra Leone")
                + [data-test="org-unit-selector-tree-node-leaves"]
                > [data-test="org-unit-selector-tree-node"]
            `
    ).should('have.length.of.at.least', 2)
})

When('the user closes the org unit selector', () => {
    cy.get('[data-test="dhis2-uicore-layer"]').click('topRight')
})

Then('the org unit tree should be hidden', () => {
    cy.get('[data-test="org-unit-selector-tree"]').should('not.exist')
})

Then('the filter should still be set', () => {
    cy.get('#context-selection-org-unit-search')
        .invoke('val')
        .should('equal', 'Bombali')
})

When(
    'the user selects a different data set connected to the currently selected org unit',
    () => {
        cy.getSelectorValueLabelByContent(
            'Data set',
            'ART monthly summary'
        ).click()

        cy.contains('Child Health')
    }
)

Then('the org unit should remain selected', () => {
    cy.getSelectorValueLabelByContent(
        'Organisation unit',
        'Sierra Leone'
    ).should('exist')
})
