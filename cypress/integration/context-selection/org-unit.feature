Feature: An org unit can be selected

    Scenario: The selector is hidden
        Given no data set has been selected
        Then a tooltip with the content "Choose a data set first" should be shown

    Scenario: No value is being displayed
        Given a data set and no org unit have been selected yet
        Then a no-value-label should be displayed

    Scenario: The selected org unit's data is being retrieved
        Given a data set and an org unit have been selected
        Then a loading message should be displayed while loading its data
        When loading the org unit is done
        Then its value-label should be displayed

    Scenario: Retrieving a selected org unit's data fails
        Given a data set and an org unit have been selected
        Then a loading message should be displayed while loading its data
        When loading the org unit fails
        Then an error message should be displayed

    Scenario: An org unit gets selected
        Given the user has selected a data set
        When the user opens the org unit selector
        And the root org units have been loaded
        And selects an org unit
        Then the org unit's display name should be displayed as selected value
        And the org unit's id should be persisted

    # @TODO: How should this work when the app is offline?
    # @proposal: Only search the loaded org units instead of using the api
    Scenario: The user filters the org units
        Given the user has selected a data set
        When the user opens the org unit selector
        And the root org units have been loaded
        When the user filters the org units by the name of a non-root org unit
        Then the org unit tree should only display nodes up until the filtered org unit

    # The "expanded" state should be persisted per session
    Scenario: The user closes and opens the org unit selector
        Given the user has selected a data set
        When the user opens the org unit selector
        And the root org units have been loaded
        And the user opens expands the root org unit
        Then the root org unit's children should be displayed
        When the user closes the org unit selector
        Then the org unit tree should be hidden
        When the user opens the org unit selector
        Then the root org unit's children should be displayed

    # The "filter" state should be persisted per session
    Scenario: The user filters, then closes and opens the org unit selector
        Given the user has selected a data set
        When the user opens the org unit selector
        And the root org units have been loaded
        When the user filters the org units by the name of a non-root org unit
        Then the org unit tree should only display nodes up until the filtered org unit
        When the user closes the org unit selector
        Then the org unit tree should be hidden
        When the user opens the org unit selector
        Then the org unit tree should only display nodes up until the filtered org unit

    Scenario: The user changes the data set to one that's also connected to the selected org unit
        Given a data set and an org unit have been selected
        When the user selects a different data set connected to the currently selected org unit
        Then the org unit should remain selected

    Scenario: The user changes the data set to one that's not connected to the selected org unit
        Given a data set and an org unit have been selected
        When the user selects a different data set not connected to the currently selected org unit
        Then the org unit should be deselected
