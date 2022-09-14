import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('no data set has been selected yet', () => {
    cy.visit('/')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set and period but no org unit have been selected yet', () => {
    cy.visit('/#/?dataSetId=V8MHeZHIrcP&periodId=2021')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set and org unit but no period have been selected yet', () => {
    cy.visit('/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given('a data set, org unit & period have been selected', () => {
    cy.visit('/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212')
    cy.get('[data-test="data-set-selector"]').should('exist')
})

Given(
    "a data set, org unit & period have been selected and the current date is outside the range of all of the option's validity dates of one category",
    () => {
        cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
            fixture:
                'context-selection/metadata-with-cat-combo-with-all-options-of-one-cat-between-20200101-20201231.json',
        })

        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    "a data set, org unit & period have been selected and the current date is outside the range of one of the category option's validity dates",
    () => {
        cy.intercept('GET', /api[/][0-9]*[/]dataEntry[/]metadata/, {
            fixture:
                'context-selection/metadata-with-cat-combo-with-option-between-20200101-20201231.json',
        })

        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    "a data set, org unit & period have been selected and the data set's category combination is the default one",
    () => {
        cy.visit(
            '/#/?dataSetId=BfMAe6Itzgt&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit & period have been selected but loading the category combination fails',
    () => {
        cy.intercept(
            'GET',
            new RegExp('dataSets/lyLU2wR22tC[?]fields=categoryCombo'),
            { statusCode: 404, body: '404 Not Found!' }
        )

        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit & period have been selected but the data set does not have any categories connected to it',
    () => {
        cy.visit(
            '/#/?dataSetId=BfMAe6Itzgt&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit and period have been selected and there are some categories connected to the data set',
    () => {
        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit, period and some but not all options have been selected and there are some categories connected to the data set',
    () => {
        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212&attributeOptionComboSelection=LFsZ8v5v7rq-CW81uF03hvV'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given(
    'a data set, org unit, period and some but not all options have been selected and there are some categories connected to the data set',
    () => {
        cy.visit(
            '/#/?dataSetId=lyLU2wR22tC&orgUnitId=ImspTQPwCqd&periodId=202212&attributeOptionComboSelection=LFsZ8v5v7rq-CW81uF03hvV'
        )
        cy.get('[data-test="data-set-selector"]').should('exist')
    }
)

Given('a data set, org unit, period and options have been selected', () => {
    cy.visit(
        '#/?attributeOptionComboSelection=yY2bQYqNt0o-M58XdOfhiJ7&dataSetId=TuL8IOPzpHh&orgUnitId=DiszpKrYNg8&periodId=202112'
    )
    cy.get('[data-test="data-set-selector"]').should('exist')
})

When('the user opens the dropdown for the category of that option', () => {
    cy.get('[data-test="attribute-option-combo-selector"]').click()
    cy.contains(
        '[data-test="dhis2-uiwidgets-singleselectfield"]',
        'Implementing Partner'
    )
        .find('[data-test="dhis2-uicore-select"]')
        .click()
    cy.contains('African Medical and Research Foundation').should('not.exist')
})

When('the user selects a new period that options are valid for', () => {
    cy.contains('December 2021').should('exist')
    cy.get('[data-test="period-selector"]').click()
    cy.get('[data-test="period-selector-menu"] li:nth-child(2)').click()
})

When(
    'the user selects a new organisation unit that options are not valid for',
    () => {
        cy.contains('Ngelehun').should('exist')
        cy.get('[data-test="org-unit-selector"] button').click()
        cy.get(
            `[data-test="org-unit-selector-tree"] :contains("Sierra Leone")`
        ).should('exist')
        cy.get(
            `[data-test="org-unit-selector-tree-node-label"]:contains('Sierra Leone')`
        ).click()
    }
)

// the user selects a new period that options are also valid for
// the user selects a new organisation unit that options are not valid for
Then(
    "the available options should not containe the option that's out of bound",
    () => {}
)

Then('the default options should be selected automatically', () => {
    cy.get('[data-test="dhis2-ui-selectorbar"]').contains(
        'Default attribute combo'
    )
})

Then(
    'the selector indicates that the default category and default option has been selected',
    () => {}
)

Then('the selector should not be displayed', () => {
    cy.get('[data-test="attribute-option-combo-selector"]').should('not.exist')
})

Then(
    'the selector should be displayed once the categories and options have been loaded',
    () => {
        cy.get('[data-test="attribute-option-combo-selector"]').should('exist')
    }
)

Then('the selector should show that zero items have been selected', () => {
    cy.get('[data-test="dhis2-ui-selectorbar"]')
        .contains('0 selections')
        .should('exist')
})

Then('the selector should show that some items have been selected', () => {
    cy.get('[data-test="dhis2-ui-selectorbar"]')
        .contains('1 selection')
        .should('exist')
})

Then('a message is being displayed in the data workspace', () => {
    cy.contains('The current selection does not have a form').should('exist')
})

Then('a message is being displayed in the data workspace', () => {
    cy.contains('The current selection does not have a form').should('exist')
})

Then(
    'the selected category option {string} is still selected',
    (categoryOptionName) => {
        cy.contains(categoryOptionName).should('exist')
    }
)

Then(
    'the selected category option {string} is not selected',
    (categoryOptionName) => {
        cy.contains(categoryOptionName).should('not.exist')
    }
)
