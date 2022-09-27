import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const getDataSetSelectorValueLabelByContent = (selectorValueLabel) => {
    return cy.getSelectorValueLabelByContent('Data set', selectorValueLabel)
}

Given('one of some selectable data sets has been selected', () => {
    cy.fixture('context-selection/metadata-complete').then((metadata) => {
        cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
            body: metadata,
        }).as('selectableDataSetsRequest')

        const selectedDataSet = metadata.dataSets[0]
        cy.wrap(selectedDataSet).as('selectedDataSet')

        cy.visitAndLoad(`/#/?dataSetId=${selectedDataSet.id}`)
    })
})

Given('no data set has been selected yet', () => {
    cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
        fixture: 'context-selection/metadata-complete',
    }).as('selectableDataSetsRequest')

    cy.visitAndLoad('/')
})

Given('no selectable data set exists', () => {
    cy.fixture('context-selection/metadata-complete').then((metadata) => {
        cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
            body: {
                ...metadata,
                dataSets: [],
            },
        }).as('selectableDataSetsRequest')

        cy.visitAndLoad('/')
    })
})

Given('some selectable data sets exists', () => {
    cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
        fixture: 'context-selection/metadata-complete',
    }).as('selectableDataSetsRequest')

    cy.visitAndLoad('/')
})

Given('only one selectable data set exists', () => {
    cy.fixture('context-selection/metadata-complete').then((metadata) => {
        const response = {
            ...metadata,
            dataSets: [
                {
                    displayName: 'Lonely dataset',
                    id: 'allByMyself',
                    categoryCombo: { id: 'bjDvmb4bfuf' },
                },
            ],
        }

        cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
            body: response,
        }).as('selectableDataSetsRequest')

        cy.visitAndLoad('/')
    })
})

When('selects a data set', () => {
    cy.fixture('context-selection/metadata-complete').then(({ dataSets }) => {
        cy.get('[data-test="data-set-selector-menu"] li:first-child')
            .click()
            .invoke('text')
            .then((label) => {
                const dataSet = dataSets.find(
                    ({ displayName }) => displayName === label
                )
                cy.wrap(dataSet).as('selectedDataSet')
            })
    })
})

When('the user opens the menu', () => {
    // the menu should not be opened
    cy.get('[data-test="data-set-selector-menu"]').should('not.exist')
    cy.get('[data-test="data-set-selector"] button').click()
})

Then('a list of data sets should be displayed', () => {
    cy.get('[data-test="data-set-selector-menu"] li').should(
        'have.length.of.at.least',
        1
    )
})

Then('a no-value-label should be displayed', () => {
    cy.contains('Choose a data set').should('exist')
})

Then('a value-label should be displayed', () => {
    cy.contains('Choose a data set').should('not.exist')
})

Then('nothing but a loading message should be displayed', () => {
    cy.get(
        '[data-test="data-set-selector-loading-msg"]:first-child:last-child'
    ).should('exist')
})

Then('nothing but a no-data-available message should be displayed', () => {
    cy.get(
        '[data-test="data-set-selector-none-available-msg"]:first-child:last-child'
    ).should('exist')
})

Then('nothing but an error message should be displayed', () => {
    cy.get(
        '[data-test="data-set-selector-error-msg"]:first-child:last-child'
    ).should('exist')
})

Then('the only available data set should be selected', () => {
    cy.fixture('context-selection/metadata-complete').then(({ dataSets }) => {
        const [dataSet] = dataSets
        const { displayName } = dataSet
        getDataSetSelectorValueLabelByContent(displayName).should('exist')
    })
})

Then(
    "the data set's display name should be shown in the context selection",
    () => {
        cy.get('@selectedDataSet').then((selectedDataSet) => {
            const { displayName } = selectedDataSet
            getDataSetSelectorValueLabelByContent(displayName).should('exist')
        })
    }
)

Then("the data set's id should be in the url as a parameter", () => {
    cy.all(
        () => cy.get('@selectedDataSet'),
        () => cy.url()
    ).then(([selectedDataSet, url]) => {
        expect(url).to.include(`dataSetId=${selectedDataSet.id}`)
    })
})
