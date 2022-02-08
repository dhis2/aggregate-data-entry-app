Feature: Category options for each category in the category combination connected to the data set can be selected

    Scenario: No data set has been selected
        Given no data set has been selected yet
        Then the selector should not be displayed

    Scenario: No org unit has been selected
        Given a data set and period but no org unit have been selected yet
        Then the selector should not be displayed

    Scenario: No period has been selected
        Given a data set and org unit but no period have been selected yet
        Then the selector should not be displayed

    Scenario: The data set is not connected to any category combo
        Given a data set, org unit & period have been selected but the data set does not have any categories connected to it
        Then the selector should not be displayed

    Scenario: The category combination is being loaded
        Given a data set, org unit & period have been selected
        Then the selector should be displayed once the categories and options have been loaded

    Scenario: Loading the category combination fails
        Given a data set, org unit & period have been selected but loading the category combination fails
        Then the selector should not be displayed

    Scenario: No option has been selected
        Given a data set, org unit and period have been selected and there are some categories connected to the data set
        Then the selector should show that zero items have been selected

    Scenario: Some but not all options have been selected
        Given a data set, org unit, period and some but not all options have been selected and there are some categories connected to the data set
        Then the selector should show that some items have been selected

    Scenario: The data set's category combination is the default
        Given a data set, org unit & period have been selected and the data set's category combination is the default one
        Then the default options should be selected automatically

    Scenario: A category option gets filtered out because it's start/end date are "out of bound"
        Given a data set, org unit & period have been selected and the current date is outside the range of one of the category option's validity dates
        When the user opens the dropdown for the category of that option
        Then the available options should not containe the option that's out of bound

    Scenario: All options of one category are "out of bound"
        Given a data set, org unit & period have been selected and the current date is outside the range of all of the option's validity dates of one category
        Then the attribute option combo selector is hidden
        And a message is being displayed in the data workspace
