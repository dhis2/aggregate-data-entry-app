Feature: A section filter can be selected

    Scenario: No data set has been selected
        Given no data set has been selected yet
        Then the selector should not be displayed

    Scenario: No org unit has been selected
        Given a data set but no org unit has been selected yet
        Then the selector should not be displayed

    Scenario: No period has been selected
        Given a data set but no period has been selected yet
        Then the selector should not be displayed

    Scenario: The data set's section info is being loaded

    Scenario: Loading the data set's section info fails

    Scenario: The data set has no sections

    Scenario: The data set's section is of type default

    Scenario: The data set is has custom form

    Scenario: The default selector value is selected initially

    Scenario: The user selects a filter section

    Scenario: The user selects the default selector value to unset the selection
