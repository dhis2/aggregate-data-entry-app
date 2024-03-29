Feature: A period can be selected

    Scenario: No data set has been selected
        Given no data set has been selected
        When the user hovers the org unit selector
        Then a tooltip with the content "Choose a data set first" should be shown

    Scenario: No value is being displayed
        Given a data set has been selected
        Then a no-value-label should be displayed

    Scenario Outline: A data set with period range <type> gets selected
        Given a data set with period range "<type>" has been selected
        When the user opens the period selector
        Then the user should only see options of that type for "<type>"
        Examples:
            | type    |
            | yearly  |
            | monthly |
            | quarterly |
            | sixMonthly |
            | weekly |
            | financialApril |

    Scenario: A period gets selected
        Given a data set has been selected
        When the user opens the period selector
        And selects the first period option
        Then that period option should be shown as the current value in the selector
        And the period id should be persisted in the url

    Scenario: A data set with a different period range gets selected while a period has been selected
        Given a data set with period range "yearly" and a period has been selected
        When the user selects a different data set with period range "monthly"
        Then the previously selected period should be deselected

    Scenario: A data set with the same period range gets selected while a period has been selected
        Given a data set with period range "yearly" and a period has been selected
        When the user selects a different data set with the period range "yearly"
        Then the previously selected period should still be selected

    Scenario: The user enters a link with an invalid period
        Given a link references a period which is not valid
        Then a no-value-label should be displayed

    Scenario: The user enters a link with an period of a type that does not match data set's period type
        Given a link references a period of a different type than that associated with the data set
        Then a no-value-label should be displayed

    Scenario: The user enters a link with an period in the future (beyond the data set's allowed open future periods)
        Given a link references a period in the future beyond the allowed open future periods for the data set
        Then a no-value-label should be displayed
