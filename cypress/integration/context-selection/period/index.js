import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('a data set has been selected', () => {
    cy.visit(`/#/?dataSetId=lyLU2wR22tC`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "yearly" and a period has been selected', () => {
    cy.visit(`/#/?dataSetId=V8MHeZHIrcP&periodId=2021`)
    // Make sure athe current period is being displayed
    cy.get('[data-test="period-selector"]').contains("2021").should('exist')
})

Given('a data set with period range "monthly" has been selected', () => {
    cy.visit(`/#/?dataSetId=lyLU2wR22tC`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "yearly" has been selected', () => {
    cy.visit(`/#/?dataSetId=V8MHeZHIrcP`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('no data set has been selected', () => {
    cy.visit('/')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

When('selects the first period option', () => {
    cy.get('[data-test="period-selector-menu"] li:first-child').as('firstOption')

    cy.get('@firstOption').invoke('text').as('selectedPeriodLabel')
        .then(console.log.bind(null, 'first option label'))

    cy.get('@firstOption')
        .find('[data-value]')
        .invoke('attr', 'data-value')
        .as('selectedPeriodValue')
        .then(console.log.bind(null, 'first option value'))

    cy.get('@firstOption').click()
})

When('the user hovers the org unit selector', () => {
    cy.get('[data-test="period-selector"] button > .label').trigger(
        'mouseover'
    )
})

When('the user opens the period selector', () => {
    cy.get('[data-test="period-selector"]').click()
})

When('the user selects a different data set with period range "monthly"', () => {
    cy.url().then(url => {
        const [, periodId] = url.match(/&periodId=([^&]*)(&|$)/)
        cy.wrap(periodId).as('previousPeriodId')
    })

    cy.get('[data-test="data-set-selector"]').click()
    cy.get(`[data-value="lyLU2wR22tC"]`)
        // because we can't pass `data-value` to the menu item, it has to be
        // put on the label, hence we have to go up the dom tree to the li
        // element
        .parents('li')
        .click()
})

When('the user selects a different data set with the period range "yearly"', () => {
    cy.url().then(url => {
        const [, periodId] = url.match(/&periodId=([^&]*)(&|$)/)
        cy.wrap(periodId).as('previousPeriodId')
    })

    cy.get('[data-test="data-set-selector"]').click()
    cy.get(`[data-value="aLpVgfXiz0f"]`)
        // because we can't pass `data-value` to the menu item, it has to be
        // put on the label, hence we have to go up the dom tree to the li
        // element
        .parents('li')
        .click()
})

Then('a no-value-label should be displayed', () => {
    cy.contains('Choose a period').should('exist')
})

Then('a tooltip with the content "Choose a data set first" should be shown', () => {
    cy.contains('Choose a data set first').should('exist')
})

Then('that period option should be shown as the current value in the selector', () => {
    cy.get('@selectedPeriodLabel').then(selectedPeriodLabel => {
        cy.get('[data-test="period-selector"]')
            .contains(selectedPeriodLabel)
            .should('exist')
    })
})

Then('the period id should be persisted in the url', () => {
    cy.get('@selectedPeriodValue').then(selectedPeriodValue => {
        cy.url().should('match', new RegExp(`&periodId=${selectedPeriodValue}`))
    })
})

Then('the previously selected period should be deselected', () => {
    cy.contains('Choose a period').should('exist')
})

Then('the previously selected period should still be selected', () => {
    cy.get('@previousPeriodId').then(previousPeriodId => {
        cy.get('[data-test="period-selector"]').contains(previousPeriodId).should('exist')
        cy.url().should('match', new RegExp(`&periodId=${previousPeriodId}`))
    })
})

Then('the user should only see options of that type for "monthly"', () => {
    cy.get('[data-test="period-selector-menu"] li').should('have.length', 12)
})

Then('the user should only see options of that type for "yearly"', () => {
    cy.get('[data-test="period-selector-menu"] li')
        .should('have.length', 10)
        .and(liElements => {
            liElements.each((index, liElement) => {
                expect(liElement.innerText).to.match(/^[0-9]{4}$/)
            })
        })
})
