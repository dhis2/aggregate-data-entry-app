# Author: Morten Svanæs
@live-org-unit-search
Feature: Live organisation unit search performance and response ordering
    # Outside the ordinary e2e spec glob: only run explicitly against a seeded instance.
    Scenario: Search, page and replace results using the fixture oracle
        Given the live organisation unit search fixture is selected
        When I measure short input and the existing search debounce
        And I inspect the bounded first page and use Next page
        And I rapidly replace the search term
        And an old real search response arrives after the replacement results
        Then I save the live search timeline and evaluate its contracts
