![React 18](https://img.shields.io/badge/react-18-blue)

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

## Opt-in live organisation unit search benchmark

`cypress/benchmarks/org-unit-search.feature` is deliberately outside the ordinary
`cypress/e2e/**/*.feature` glob. It never uses captured/demo responses. Seed the
backend with the matching `fixtureVersion: 1` search fixture and use its generated
manifest unchanged for both app variants. The manifest's `client.orgUnits` supplies
fixture-generated English labels/paths for the expected leaves and their ancestors;
HTTP search results are never used as the expectation.

With the app and API already running, invoke from this checkout:

```sh
export CYPRESS_ouSearchManifest=/absolute/path/to/manifest.json
export CYPRESS_dhis2BaseUrl="$OUBENCH_API_URL"
export CYPRESS_dhis2Username="$(jq -r '.client.username' "$CYPRESS_ouSearchManifest")"
export CYPRESS_dhis2Password="${OUBENCH_PASSWORD:?Supply the synthetic fixture password}"
export CYPRESS_ouSearchOutput=/absolute/path/to/candidate-client.json
export CYPRESS_ouSearchVariant=candidate
export CYPRESS_ouSearchMode=assert
yarn cypress run --browser chrome \
  --config "baseUrl=$OUBENCH_APP_URL,specPattern=cypress/benchmarks/org-unit-search.feature,responseTimeout=480000" \
  --env 'networkMode=live,stepDefinitions=cypress/benchmarks/org-unit-search/**/*.js'
```

`OUBENCH_API_URL` is the instance root (without `/api`); `OUBENCH_APP_URL`
is the app origin/path supplied to Cypress `baseUrl`. Use the existing
`dhis2ApiVersion` environment setting when overriding the configured version.
Authentication uses the existing `enableAutoLogin`/`dhis2Username`/
`dhis2Password` conventions. Never embed credentials in URLs or the manifest.
The fixture user must have the usable monthly dataset and assigned leaves
described by the manifest; selection uses its real dataset bookmark and ends by
clicking an assigned replacement leaf.

For a fresh local fixture, allow the **app origin** in the backend CORS configuration.
The Core fixture seeder accepts, for example,
`-DouSearch.corsOrigins=http://localhost:3003,http://localhost:3004` during explicit setup.
The dataset must use modern `sharing.public` data-write access; legacy `publicAccess`
is not sufficient on current Core. Regenerate copied app shells with
`yarn start --force --port 3003 --proxy "$BACKEND_URL" --proxyPort 8088` so two
checkouts do not reuse an old checkout's Vite dependency cache.

On Linux without Cypress system dependencies such as Xvfb, use the matching included
image. Set `ARTIFACT_DIR` to an existing output directory; the manifest is mounted read-only:

```sh
docker run --rm --network host --shm-size=2g \
  -v "$PWD:/e2e" -v "$CYPRESS_ouSearchManifest:/fixture.json:ro" \
  -v "$ARTIFACT_DIR:/artifacts" -w /e2e \
  -e CYPRESS_ouSearchManifest=/fixture.json \
  -e CYPRESS_dhis2BaseUrl -e CYPRESS_dhis2Username -e CYPRESS_dhis2Password \
  -e CYPRESS_ouSearchMode -e CYPRESS_ouSearchVariant \
  -e CYPRESS_ouSearchOutput=/artifacts/client.json \
  cypress/included:12.17.4 --browser chrome \
  --config "baseUrl=$OUBENCH_APP_URL,specPattern=cypress/benchmarks/org-unit-search.feature,responseTimeout=480000" \
  --env 'networkMode=live,stepDefinitions=cypress/benchmarks/org-unit-search/**/*.js'
```

To observe the unchanged historical client, point `OUBENCH_APP_URL` at that app,
set `CYPRESS_ouSearchVariant=baseline`, `CYPRESS_ouSearchMode=observe`, and choose
a different `CYPRESS_ouSearchOutput`. Keep the fixture, backend variant, browser
and timings identical when isolating client changes. Observation mode records
contract failures (including unbounded responses, short-input requests, missing
pagination and stale/wrong UI) without asserting that they passed. Setup,
authentication, navigation and browser errors still fail. Candidate `assert` mode
fails after writing the artifact if any contract fails. A completed observation
run is not a correctness pass: inspect `scenarioCompleted` and
`summary.failedContracts`.

The scenario holds one and two characters for 350 ms, types with 20 ms/key,
pauses above the **existing 200 ms debounce**, uses the actual Next page button,
and rapidly replaces terms in one continuous typing command, without pauses between
replacement terms. Actual input values and timestamps are recorded. It scrolls and
expands fixture ancestors, brings expected leaves into view, and sweeps the popup
to reject extra/stale labels without assuming all nodes are rendered simultaneously.
For the race, case variants `bENCH` and `nEEDLE`
preserve the `ilike` oracle while avoiding previously used client query-cache
keys. Cypress holds the *real* old response until the new results have been
inspected, then releases it and inspects the tree again; no response body is
fabricated. The safety deadline is a failed contract, not a successful race.

The JSON includes full observed GET API URLs, request counts, request/response/
delivery timestamps, response statuses and sizes, paging/search response-oracle
checks, typing/visible-result milestones and contract violations. It includes no
request headers, login bodies or passwords. `jsonBytes` measures UTF-8 serialized
JSON, **not compressed wire bytes**; the content-length header is separate. A 304
is marked as revalidation with zero wire JSON bytes and validated against the
previously observed 200 representation for that exact URL—not against a fabricated
body from the fixture oracle. An unknown-cache 304 fails.
`backendElapsedMs` measures dispatch to the proxy's real response, including
network time, not pure server CPU time. Artificially held responses have
`artificialDelay: true` and a separate `holdMs`; exclude their total elapsed time
from natural latency comparisons. A native `afterEach` hook also saves partial
timelines on failures, including setup failures. Optional `ouSearchTimeoutMs` (default 120000) and
`ouSearchUiTimeoutMs` (default 15000) bound observation waits; use identical
values for comparisons. No app source or normal functional suites are changed.
