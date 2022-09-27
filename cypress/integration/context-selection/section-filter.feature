Feature: A section filter can be selected

    Scenario: No data set has been selected
        Given no data set has been selected yet
        Then the section filter selector should not be displayed

    Scenario: No org unit has been selected
        Given a data set but no org unit has been selected yet
        Then the section filter selector should not be displayed

    Scenario: No period has been selected
        Given a data set but no period has been selected yet
        Then the section filter selector should not be displayed

    Scenario: The data set has no sections
        Given a data set, org unit and period have been selected and the data set does not have sections
        Then the section filter selector should not be displayed

    Scenario: The data set's section is of type default
        Given a data set, org unit and period have been selected and the data set is of type default
        Then the section filter selector should not be displayed

    Scenario: The data set is has custom form
        Given a data set, org unit and period have been selected and the data set has a custom form
        Then the section filter selector should not be displayed

    Scenario: The default selector value is selected initially
        Given a data set, org unit and period have been selected and the data set has some sections
        Then the section filter selector should be displayed
        And the "all sections" option should be selected

    Scenario: The user selects a filter section
        Given a data set, org unit and period have been selected and the data set has some sections
        When the user selects a section
        Then that section should be selected
        And the section id should be reflected in the url

    Scenario: The data set is a tabbed sectioned form
        Given a data set, org unit and period have been selected and the data set has a tabbed sectioned form
        Then the first section should be selected by default
        And no "all sections" option should be available

    Scenario: The user enters a link with an period in the future (beyond the data set's allowed open future periods)
        Given a link references an invalid section
        Then the "all sections" option should be selected