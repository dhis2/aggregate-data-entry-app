import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// It seems that the new cypress cucumber library splits different steps into
// different test cases. Cypress does not persist aliases across tests,
// mutable seem to be working though
let selectedPeriodLabel = ''
let selectedPeriodValue = ''

Given('a data set has been selected', () => {
    cy.visit(`/#/?dataSetId=Nyh6laLdBEJ`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given(
    'a data set with period range "yearly" and a period has been selected',
    () => {
        cy.visit(`/#/?dataSetId=V8MHeZHIrcP&periodId=2021`)
        // Make sure athe current period is being displayed
        cy.get('[data-test="period-selector"]').contains('2021').should('exist')
    }
)

Given('a data set with period range "monthly" has been selected', () => {
    // Using 2021 here because the current year will render a
    // subset of the month's options (except for december)
    cy.visit(`/#/?dataSetId=lyLU2wR22tC&periodId=202101`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "yearly" has been selected', () => {
    cy.visit(`/#/?dataSetId=V8MHeZHIrcP`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "quarterly" has been selected', () => {
    // Using 2021 here because the current year will render a subset of periods
    cy.visit(`/#/?dataSetId=EKWVBc5C0ms&periodId=2021Q1`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "sixMonthly" has been selected', () => {
    // Using 2021 here because the current year will render a subset of periods
    cy.visit(`/#/?dataSetId=N4fIX1HL3TQ&periodId=2021S2`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "financialApril" has been selected', () => {
    cy.visit(`/#/?dataSetId=rsyjyJmYD4J&periodId=2021April`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set with period range "weekly" has been selected', () => {
    // Using 2021 here because the current year will render a subset of periods
    cy.visit(`/#/?dataSetId=Nyh6laLdBEJ&periodId=2021W52`)
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('no data set has been selected', () => {
    cy.visit('/')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a link references a period which is not valid', () => {
    cy.visit(`/#/?dataSetId=lyLU2wR22tC&periodId=FakePeriod`)
})

Given(
    'a link references a period of a different type than that associated with the data set',
    () => {
        cy.visit(`/#/?dataSetId=lyLU2wR22tC&periodId=2020`)
    }
)

Given(
    'a link references a period in the future beyond the allowed open future periods for the data set',
    () => {
        cy.visit(`/#/?dataSetId=lyLU2wR22tC&periodId=210012`)
    }
)

When('selects the first period option', () => {
    cy.get('[data-test="period-selector-menu"] li:first-child').as(
        'firstOption'
    )

    cy.get('@firstOption')
        .invoke('text')
        .then((curSelectedPeriodLabel) => {
            selectedPeriodLabel = curSelectedPeriodLabel
        })

    cy.get('@firstOption')
        .find('[data-value]')
        .invoke('attr', 'data-value')
        .then((curSelectedPeriodValue) => {
            selectedPeriodValue = curSelectedPeriodValue
        })

    cy.get('@firstOption').click()
})

When('the user hovers the org unit selector', () => {
    cy.get('[data-test="period-selector"] button > .label').trigger('mouseover')
})

When('the user opens the period selector', () => {
    cy.get('[data-test="period-selector"]').click()
})

When(
    'the user selects a different data set with period range "monthly"',
    () => {
        cy.url().then((url) => {
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
    }
)

When(
    'the user selects a different data set with the period range "yearly"',
    () => {
        cy.url().then((url) => {
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
    }
)

Then('a no-value-label should be displayed', () => {
    cy.contains('Choose a period').should('exist')
})

Then(
    'a tooltip with the content "Choose a data set first" should be shown',
    () => {
        cy.contains('Choose a data set first').should('exist')
    }
)

Then(
    'that period option should be shown as the current value in the selector',
    () => {
        console.log('> then: selectedPeriodLabel', selectedPeriodLabel)
        cy.get('[data-test="period-selector"]')
            .contains(selectedPeriodLabel)
            .should('exist')
    }
)

Then('the period id should be persisted in the url', () => {
    cy.url().should('match', new RegExp(`&periodId=${selectedPeriodValue}`))
})

Then('the previously selected period should be deselected', () => {
    cy.contains('Choose a period').should('exist')
})

Then('the previously selected period should still be selected', () => {
    cy.get('@previousPeriodId').then((previousPeriodId) => {
        cy.get('[data-test="period-selector"]')
            .contains(previousPeriodId)
            .should('exist')
        cy.url().should('match', new RegExp(`&periodId=${previousPeriodId}`))
    })
})

Then('the user should only see options of that type for "monthly"', () => {
    // go back to prev year to ensure we have a complete list of periods in the
    // dropdown
    cy.get('[data-test="yearnavigator-backbutton"]').click()
    cy.get('[data-test="period-selector-menu"] li').should('have.length', 12)
})

Then('the user should only see options of that type for "yearly"', () => {
    const currentYear = new Date().getFullYear()
    const yearsToBeDisplayed = currentYear - 1970 // year of 0-timestamp

    cy.get('[data-test="period-selector-menu"] li')
        .should('have.length', yearsToBeDisplayed)
        .and((liElements) => {
            liElements.each((index, liElement) => {
                expect(liElement.innerText).to.match(/^[0-9]{4}$/)
            })
        })
})

Then('the user should only see options of that type for "quarterly"', () => {
    // go back to prev year to ensure we have a complete list of periods in the
    // dropdown
    cy.get('[data-test="yearnavigator-backbutton"]').click()
    cy.get('[data-test="period-selector-menu"] li').should('have.length', 4)
})

Then('the user should only see options of that type for "sixMonthly"', () => {
    // go back to prev year to ensure we have a complete list of periods in the
    // dropdown
    cy.get('[data-test="yearnavigator-backbutton"]').click()
    cy.get('[data-test="period-selector-menu"] li').should('have.length', 2)
})

Then(
    'the user should only see options of that type for "financialApril"',
    () => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const beforeApril = currentMonth < 3 // 0-based index

        // When current date before april,
        // the future periods only span into the next year
        // 2 openFuturePeriods for dataset
        //   -> before April => current period + 1 extra year
        //   -> after March => curent period (reaching into next year) + 2
        //      extra years (reaching into the year after the next year)
        const extraYears = beforeApril ? 1 : 2

        // year of 0-timestamp,
        // 2 openFuturePeriods for dataset -> current period + 1 extra year
        const yearsToBeDisplayed = currentYear - 1970 + extraYears

        cy.get('[data-test="period-selector-menu"] li').should(
            'have.length',
            yearsToBeDisplayed
        )
    }
)

// count varies by year; for 2022: 52 + 1 weeks (1 for the last week of the
// previous year stretching into 2022)
Then('the user should only see options of that type for "weekly"', () => {
    function goBackUntil2022() {
        cy.get('[data-test="yearnavigator-currentyear"]').then(($curYear) => {
            if (parseInt($curYear.text(), 10) > 2022) {
                cy.get('[data-test="yearnavigator-backbutton"]').click()
                goBackUntil2022()
            }
        })
    }

    // go back to ensure we have a complete list of periods in the dropdown
    goBackUntil2022()

    cy.get('[data-test="period-selector-menu"] li').should('have.length', 53)
})
