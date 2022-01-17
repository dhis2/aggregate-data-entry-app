Feature: A data set can be selected

    Scenario: No value is being displayed
        Given no data set has been selected yet
        Then a no-value-label should be displayed

    Scenario: A value is being displayed
        Given some selectable data set exists
        And a data set has been selected
        Then a value-label should be displayed

    Scenario: The selectable data sets are being loaded
        Given the selectable data sets are being loaded
        When the user opens the menu
        Then nothing but a loading message should be displayed

    Scenario: The selectable data sets could not be loaded
        Given loading the selectable data sets failed
        When the user opens the menu
        Then nothing but an error message should be displayed

    Scenario: No selectable data sets exist
        Given no selectable data set exists
        Given loading the selectable data sets is done
        When the user opens the menu
        Then nothing but a no-data-available message should be displayed

    Scenario: Some selectable data sets exist
        Given some selectable data set exists
        Given loading the selectable data sets is done
        When the user opens the menu
        Then a list of data sets should be displayed

    Scenario: The user selects a data set
        Given some selectable data set exists
        Given loading the selectable data sets is done
        When the user opens the menu
        And selects a data set
        Then the data set's display name should be shown in the context selection
        And the data set's id should be in the url as a parameter

    Scenario: The only existing data set gets selected automatically
        Given only one selectable data set exists
        Given loading the selectable data sets is done
        Then the only available data set should be selected
