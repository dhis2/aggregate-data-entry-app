Feature: A data set can be selected

    Scenario: No value is being displayed
        Given no data set has been selected yet
        Then a no-value-label should be displayed

    Scenario: A value is being displayed
        Given one of some selectable data sets has been selected
        Then a value-label should be displayed

    Scenario: No selectable data sets exist
        Given no selectable data set exists
        When the user opens the menu
        Then nothing but a no-data-available message should be displayed

    Scenario: Some selectable data sets exist
        Given some selectable data sets exists
        When the user opens the menu
        Then a list of data sets should be displayed

    Scenario: The user selects a data set
        Given some selectable data sets exists
        When the user opens the menu
        And selects a data set
        Then the data set's display name should be shown in the context selection
        And the data set's id should be in the url as a parameter

    Scenario: The only existing data set gets selected automatically
        Given only one selectable data set exists
        Then the only available data set should be selected

    Scenario: An invalid data set is selected
        Given a link references an invalid data set
        Then a no-value-label should be displayed