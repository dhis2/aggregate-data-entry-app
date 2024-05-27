# Data entry app

[Live demo development branch](https://dhis2-data-entry.netlify.app/#/)

## Global state

We're using use-query-params to store part of the app's state in the url query
parameters. This allows users to bookmark and share specific states of the app.

## Model overview

The category model can be fairly confusing, so we've created a few diagrams to help explain and get an overview of how DHIS2 models are used in the app.

[Models used in form](./docs/category-combo-diagram.png)

[Attribute category combo diagram](./docs/attribute-category-combo-diagram.png)

## Conditional E2E Test Recording

To record e2e tests in Cypress Cloud, you can use one of the following methods based on your needs:

-   **Commit Message**: Include `[e2e record]` in your commit messages to activate recording.
-   **GitHub Labels**: Apply the `e2e record` label to your pull request to trigger recording.

This setup helps in managing Cypress Cloud credits more efficiently, ensuring recordings are only made when explicitly required.
