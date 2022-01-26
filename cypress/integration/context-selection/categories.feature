Feature: Category options for each category in the category combination connected to the data set can be selected

    Scenario: No data set has been selected
        Given no data set has been selected yet
        Then the selector should not be displayed

    Scenario: No org unit has been selected
        Given a data set but no org unit has been selected yet
        Then the selector should not be displayed

    Scenario: No period has been selected
        Given a data set but no period has been selected yet
        Then the selector should not be displayed

    Scenario: No period has been selected
        Given a data set, org unit & period have been selected but the data set does not have any categories connected to it
        Then the selector should not be displayed

    Scenario: The category combination is being loaded
        Given a data set, org unit & period have been selected
        When the category combination being loaded
        Then the selector should not be displayed

    Scenario: Loading the category combination fails
        Given a data set, org unit & period have been selected but loading the category combination fails
        Then an error message should be displayed in the drop down

    Scenario: No option has been selected
        Given a data set, org unit and period have been selected and there are some categories connected to the data set
        Then the selector should show that zero items have been selected

    Scenario: Some but not all options have been selected
        Given a data set, org unit, period and some but not all options have been selected and there are some categories connected to the data set
        Then the selector should show that zero items have been selected

    Scenario: The category combination is the default
        Given a data set, org unit & period have been selected and the category combination is the default one
        Then the default options will be selected automatically

    Scenario: The current date is outside of the range of tne category option's start and end date
        Given a data set, org unit & period have been selected but the current date is outside the range of one of the category option's validity dates
        Then @TODO
