Feature: An org unit can be selected

    Scenario: The selector is hidden
        Given no data set has been selected
        Then a no-value-label should be displayed

    Scenario: No value is being displayed
        Given a data set has been selected
        Then a no-value-label should be displayed

    Scenario: The selected org unit's data is being retrieved
        Given a data set and an org unit have been selected
        Then a loading message should be displayed while loading its data
        Then its value-label should be displayed

    Scenario: Retrieving a selected org unit's data fails
        Given a data set and an org unit have been selected but loading the org unit's data will fail
        Then an error message should be displayed

    Scenario: An org unit gets selected after a data set is selected
        Given a data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And selects the org unit "Sierra Leone"
        Then the org unit's display name "Sierra Leone" should be displayed as selected value
        And the org unit's id "ImspTQPwCqd" should be persisted

    Scenario: An org unit gets selected before a data set is selected
        Given no data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And the user expands the root org unit
        And selects the org unit "Sierra Leone"
        And the user opens the data set selector
        Then the org unit's display name "Sierra Leone" should be displayed as selected value
        And the org unit's id "ImspTQPwCqd" should be persisted
        And there should be 21 data sets available to select

    Scenario: A user clears org unit selection from data set menu
        Given no data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And the user expands the root org unit
        And selects the org unit "Bombali"
        And the user opens the data set selector
        And the user clicks button to remove data set filtering
        Then a no-value-label should be displayed
        And there should be 26 data sets available to select

    Scenario: The user tries to select an org unit that is not assigned to the dataset
        Given a data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And the user expands the root org unit
        And selects the org unit "Bombali"
        Then a no-value-label should be displayed

    # @TODO: How should this work when the app is offline?
    # @proposal: Only search the loaded org units instead of using the api
    Scenario: The user filters the org units
        Given a data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        When the user filters the org units by the name of a non-root org unit
        Then the org unit tree should only display nodes up until the filtered org unit

    # The "expanded" state should be persisted per session
    Scenario: The user closes and opens the org unit selector
        Given a data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And the user expands the root org unit
        Then the root org unit's children should be displayed
        When the user closes the org unit selector
        Then the org unit tree should be hidden
        When the user opens the org unit selector
        Then the root org unit's children should be displayed

    # The "filter" state should be persisted per session
    Scenario: The user filters, then closes and opens the org unit selector
        Given a data set has been selected
        When the user opens the org unit selector
        And the root org unit have been loaded
        And the user filters the org units by the name of a non-root org unit
        And the user closes the org unit selector
        Then the org unit tree should be hidden
        When the user opens the org unit selector
        Then the filter should still be set

    Scenario: The user changes the data set to one that's also connected to the selected org unit
        Given a data set and an org unit have been selected
        When the user selects a different data set connected to the currently selected org unit
        Then the org unit should remain selected
    
    Scenario: The user enters a link with an invalid organisation unit
        Given a link references an invalid organisation unit
        Then a no-value-label should be displayed

    Scenario: The user enters a link with an invalid organisation unit / data set combination
        Given a link references an organisation unit not assigned to the data set
        Then a no-value-label should be displayed

    # # TODO: Need to figure out why dataSet.organisationUnits only return leaf-units
    # # Otherwise this can't be implemented
    # Scenario: The user changes the data set to one that's not connected to the selected org unit
    #     Given a data set and an org unit have been selected
    #     And the user visits the app
    #     When the user selects a different data set not connected to the currently selected org unit
    #     Then the org unit should be deselected
