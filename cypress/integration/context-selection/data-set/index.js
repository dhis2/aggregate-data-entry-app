import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const SELECTABLE_DATA_SETS_REQ_URI_REGEX = /dataSets[?]/

const visit = url => {
    cy.visit(url)
    cy.get('.selector-bar-item').should('exist')
}

Given('a data set has been selected', () => {
    cy.fixture('context-selection/data-set/selectable-data-sets').then(
        ({ dataSets }) => {
            const dataSet = dataSets.find(({ id }) => id === 'lyLU2wR22tC')

            if (!dataSet) {
                throw new Error('This should really exist!')
            }

            cy.wrap(dataSet).as('selectedDataSet')
        }
    )

    visit('/#/?dataSetId=lyLU2wR22tC')
})

Given('loading the selectable data sets failed', () => {
    cy.intercept(
        /dataSets/,
        { statusCode: 404, body: '404 Not Found!' },
    ).as('selectableDataSetsRequest')

    visit('/')
})

Given('loading the selectable data sets is done', () => {
    visit('/')

    // open menu
    cy.get('[data-test="data-set-selector"] button').click()

    // Either "empty response" or <MenuSelect /> should exist
    cy.get(`
        [data-test="data-set-selector-menu"],
        [data-test="data-set-selector-none-available-msg"]
    `).should('exist')

    // Close the menu again - was only opened to check for existence of the
    // above elements
    cy.get('[data-test="dhis2-uicore-layer"]').click('topRight')

})

Given('no data set has been selected yet', () => {
    visit('/')
})

Given('no selectable data set exists', () => {
    const response = { dataSets: [] }

    cy.intercept(
        'GET',
        SELECTABLE_DATA_SETS_REQ_URI_REGEX,
        { body: response }
    ).as('selectableDataSetsRequest')
})

Given('only one selectable data set exists', () => {
    const fixture = 'context-selection/data-set/selectable-data-sets-one-only'

    cy.intercept(
        'GET',
        SELECTABLE_DATA_SETS_REQ_URI_REGEX,
        { fixture }
    ).as('selectableDataSetsRequest')
})

Given('some selectable data set exists', () => {
    const fixture = 'context-selection/data-set/selectable-data-sets'

    cy.intercept(
        'GET',
        SELECTABLE_DATA_SETS_REQ_URI_REGEX,
        { fixture }
    ).as('selectableDataSetsRequest')
})

Given('the selectable data sets are being loaded', () => {
    const fixture = 'context-selection/data-set/selectable-data-sets'

    cy.intercept(
        'GET',
        SELECTABLE_DATA_SETS_REQ_URI_REGEX,
        { fixture, delay: 100000 }
    ).as('selectableDataSetsRequest')

    visit('/')
})

When('selects a data set', () => {
    cy.fixture('context-selection/data-set/selectable-data-sets').then(
        ({ dataSets }) => {
            cy.wrap(dataSets[0]).as('selectedDataSet')
        }
    )

    cy.get(
        '[data-test="data-set-selector-menu"] li:first-child'
    ).click()
})

When('the user opens the menu', () => {
    // the menu should not be opened
    cy.get('[data-test="data-set-selector-menu"]').should('not.exist')
    cy.get('[data-test="data-set-selector"] button').click()
})

Then('a list of data sets should be displayed', () => {
    cy.get(
        '[data-test="data-set-selector-menu"] li'
    ).should('have.length.of.at.least', 1)
})

Then('a no-value-label should be displayed', () => {
    cy.contains('Choose a data set').should('exist')
})

Then('a value-label should be displayed', () => {
    cy.get('@selectedDataSet').then(selectedDataSet => {
        cy.get('button:contains("Data set")')
            .contains(selectedDataSet.displayName)
            .should('exist')
    })
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
    cy.fixture('context-selection/data-set/selectable-data-sets-one-only').then(
        ({ dataSets }) => {
            const [dataSet] = dataSets
            cy.get('[data-test="data-set-selector"] button')
                .contains(dataSet.displayName)
                .should('exist')
        }
    )
})

Then("the data set's display name should be shown in the context selection", () => {
    cy.get('@selectedDataSet').then(selectedDataSet => {
        cy.get('[data-test="data-set-selector"] button')
            .contains(selectedDataSet.displayName)
            .should('exist')
    })
})

Then("the data set's id should be in the url as a parameter", () => {
    cy.all(
        () => cy.get('@selectedDataSet'),
        () => cy.url()
    ).then(([selectedDataSet, url]) => {
        expect(url).to.include(`dataSetId=${selectedDataSet.id}`)
    })
})
