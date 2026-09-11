/** @author Morten Svanæs */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const input = '#context-selection-org-unit-search'
const labelSelector = '[data-test="org-unit-selector-tree-node-label"]'
const nodeSelector = '[data-test="org-unit-selector-tree-node"]'
const timeout = Number(Cypress.env('ouSearchTimeoutMs') || 120000)
let report
let fixture
let started
let phase
let heldResponse
let releaseOld
let releaseTimer
let oldTerm
let newTerm
let searchRepresentations

const now = () => Math.round(performance.now() - started)
const milestone = (name, detail = {}) => {
    report.milestones.push({ name, atMs: now(), ...detail })
}
const check = (name, passed, detail = {}) => {
    report.checks.push({
        name,
        passed: Boolean(passed),
        atMs: now(),
        ...detail,
    })
}
const samePaths = (actual, expected) => {
    if (actual.length !== expected.length) {
        return false
    }
    const sortedExpected = [...expected].sort()
    return [...actual]
        .sort()
        .every((path, index) => path === sortedExpected[index])
}
const pause = (ms) => cy.wait(ms, { log: false })
const searchRequests = () => report.requests.filter((request) => request.term)
const forTerm = (term) =>
    searchRequests().filter((request) => request.term === term)

// Poll without swallowing Cypress failures. Observation mode records semantic
// mismatches; authentication, navigation and JavaScript errors still fail the run.
const poll = (name, { readValue, matches }, limit = timeout) =>
    cy.then(() => {
        // Start the deadline when this command executes, not when later steps
        // are appended to Cypress's queue.
        const until = performance.now() + limit
        const attempt = () =>
            cy.get('body', { log: false }).then(($body) => {
                const value = readValue($body)
                if (matches(value) || performance.now() >= until) {
                    check(name, matches(value), { observed: value })
                    return value
                }
                return pause(100).then(attempt)
            })
        return attempt()
    })

const awaitResponse = (term, page = 1) =>
    poll(`response delivered: ${term} page ${page}`, {
        readValue: () =>
            forTerm(term).some(
                (request) =>
                    request.page === page && request.deliveredAtMs !== undefined
            ),
        matches: Boolean,
    })

const visibleLabels = ($body) =>
    $body
        .find(labelSelector)
        .filter(':visible')
        .toArray()
        .map((element) => element.textContent.trim())
const labelFor = (path) =>
    fixture.orgUnits.find((unit) => unit.path === path).displayName
const ancestorsOf = (paths) =>
    [
        ...new Set(
            paths.flatMap((path) => {
                const ids = path.split('/').filter(Boolean)
                return ids
                    .slice(0, -1)
                    .map((id, index) => `/${ids.slice(0, index + 1).join('/')}`)
            })
        ),
    ].sort((a, b) => a.split('/').length - b.split('/').length)

const inspectTree = (name, expectedPaths) => {
    const ancestors = ancestorsOf(expectedPaths)
    const allowedLabels = new Set(
        [...ancestors, ...expectedPaths].map(labelFor)
    )
    const pathByLabel = new Map(
        expectedPaths.map((path) => [labelFor(path), path])
    )
    const seenPaths = new Set()
    const unexpectedLabels = new Set()
    const uiTimeout = Number(Cypress.env('ouSearchUiTimeoutMs') || 15000)
    let viewportSamples = 0
    let scannedToBottom = false
    const tree = () => cy.get('[data-test="org-unit-selector-tree"]')
    const resetScroll = () =>
        tree().parent().scrollTo(0, 0, { ensureScrollable: false, duration: 0 })
    const matchingLabel = ($labels, label) =>
        $labels.filter((index, element) => element.textContent.trim() === label)
    const sampleViewport = ($body) => {
        viewportSamples += 1
        visibleLabels($body).forEach((label) => {
            if (pathByLabel.has(label)) {
                seenPaths.add(pathByLabel.get(label))
            }
            if (!allowedLabels.has(label)) {
                unexpectedLabels.add(label)
            }
        })
    }
    const reveal = (path, expand) => {
        const label = labelFor(path)
        // Locate offscreen DOM nodes too. Requiring :visible before scrolling
        // prevents ever reaching later wards in the popup.
        return poll(
            `${
                expand ? 'ancestor available' : 'fixture leaf available'
            }: ${name}: ${path}`,
            {
                readValue: ($body) =>
                    matchingLabel($body.find(labelSelector), label).length ===
                    1,
                matches: Boolean,
            },
            uiTimeout
        ).then((found) => {
            if (!found) {
                return
            }
            cy.get(labelSelector).then(($labels) => {
                cy.wrap(matchingLabel($labels, label))
                    .scrollIntoView({ duration: 0 })
                    .should('be.visible')
            })
            if (expand) {
                cy.get(labelSelector).then(($labels) => {
                    const $node = matchingLabel($labels, label).closest(
                        nodeSelector
                    )
                    const $toggle = $node.children(
                        '[data-test="org-unit-selector-tree-node-toggle"]'
                    )
                    // The UI Node's "open" class is the expansion state. Its
                    // leaves can be clipped/offscreen even when it is open.
                    if ($toggle.length && !$toggle.hasClass('open')) {
                        cy.wrap($toggle).click()
                    }
                })
            }
            cy.get('body', { log: false }).then(sampleViewport)
        })
    }

    poll(
        `search tree settled: ${name}`,
        {
            readValue: ($body) =>
                $body.find('[data-test="org-unit-selector-loading"]').length ===
                    0 &&
                $body.find('[data-test="org-unit-selector-tree"]').length === 1,
            matches: Boolean,
        },
        uiTimeout
    )
    resetScroll()
    // Real toggles trigger lazy child requests; each expected leaf is then
    // independently scrolled into view. No assertion requires all 50 rows to
    // fit into the popup at the same instant.
    ancestors.forEach((path) => reveal(path, true))
    expectedPaths.forEach((path) => reveal(path, false))
    resetScroll()
    cy.then(() => {
        const until = performance.now() + uiTimeout
        const scan = () =>
            cy.get('body', { log: false }).then(($body) => {
                sampleViewport($body)
                const viewport = $body
                    .find('[data-test="org-unit-selector-tree"]')
                    .parent()[0]
                scannedToBottom =
                    viewport.scrollTop + viewport.clientHeight >=
                    viewport.scrollHeight - 1
                if (
                    scannedToBottom ||
                    unexpectedLabels.size ||
                    performance.now() >= until
                ) {
                    return
                }
                // Overlapping viewports inspect every accessible row, including
                // out-of-page or stale rows below the last expected fixture leaf.
                cy.wrap(viewport).scrollTo(
                    0,
                    viewport.scrollTop +
                        Math.max(1, viewport.clientHeight * 0.75),
                    { ensureScrollable: false, duration: 0 }
                )
                return pause(100).then(scan)
            })
        return scan()
    })
    return cy.then(() => {
        const observed = {
            expectedPaths,
            visiblePaths: [...seenPaths],
            missingPaths: expectedPaths.filter((path) => !seenPaths.has(path)),
            extraCount: unexpectedLabels.size,
            extraLabelSample: [...unexpectedLabels].slice(0, 10),
            viewportSamples,
            scannedToBottom,
        }
        check(
            `visible fixture results: ${name}`,
            observed.missingPaths.length === 0 &&
                unexpectedLabels.size === 0 &&
                scannedToBottom,
            { observed }
        )
        milestone(name, observed)
    })
}

const replace = (term) => {
    cy.get(input).clear().type(term, { delay: 20 })
    cy.then(() => milestone('typing completed', { term }))
}

const recordTraffic = () => {
    cy.intercept({ method: 'GET', url: /\/api(?:\/\d+)?\// }, (request) => {
        const url = new URL(request.url)
        const filter = url.searchParams
            .getAll('filter')
            .find((value) => /^(?:displayName|name):ilike:/.test(value))
        const isSearch =
            /\/organisationUnits(?:\.json)?$/.test(url.pathname) && filter
        const term = isSearch ? filter.replace(/^[^:]+:ilike:/, '') : null
        const entry = {
            sequence: report.requests.length + 1,
            phase,
            url: request.url,
            method: request.method,
            term,
            page: Number(url.searchParams.get('page') || 1),
            startedAtMs: now(),
            artificialDelay: term === oldTerm && phase === 'stale-response',
        }
        report.requests.push(entry)
        request.on('before:response', (response) => {
            entry.backendResponseAtMs = now()
            entry.backendElapsedMs =
                entry.backendResponseAtMs - entry.startedAtMs
            entry.status = response.statusCode
            entry.jsonBytes =
                response.statusCode === 304
                    ? 0
                    : new TextEncoder().encode(
                          typeof response.body === 'string'
                              ? response.body
                              : JSON.stringify(response.body) || ''
                      ).byteLength
            entry.contentLengthHeader =
                response.headers['content-length'] || null
            if (term) {
                const units = response.body?.organisationUnits
                const cached = searchRepresentations.get(request.url)
                entry.revalidated = response.statusCode === 304
                const hasRepresentation =
                    response.statusCode === 200 ||
                    (entry.revalidated && Boolean(cached))
                // A 304 has no wire body. Validate only a representation actually
                // observed in a prior 200 for this exact URL, never fixture data.
                const paths = entry.revalidated
                    ? cached?.paths || []
                    : Array.isArray(units)
                    ? units.map((unit) => unit.path)
                    : []
                entry.resultCount = entry.revalidated
                    ? cached?.resultCount ?? null
                    : Array.isArray(units)
                    ? units.length
                    : null
                if (entry.revalidated) {
                    entry.representationSourceSequence =
                        cached?.sequence ?? null
                    entry.representationJsonBytes = cached?.jsonBytes ?? null
                    check(
                        `known cached search representation: request ${entry.sequence}`,
                        Boolean(cached)
                    )
                } else if (
                    response.statusCode === 200 &&
                    Array.isArray(units)
                ) {
                    searchRepresentations.set(request.url, {
                        sequence: entry.sequence,
                        paths,
                        resultCount: entry.resultCount,
                        jsonBytes: entry.jsonBytes,
                    })
                }
                entry.pathSample = paths.slice(0, 5)
                let expected
                if (term.toLowerCase() === fixture.searchTerm.toLowerCase()) {
                    expected =
                        entry.page === 2
                            ? fixture.secondPagePaths
                            : fixture.firstPagePaths
                } else if (
                    term.toLowerCase() === fixture.replacementTerm.toLowerCase()
                ) {
                    expected = fixture.replacementPaths
                }
                if (expected) {
                    check(
                        `response oracle: request ${entry.sequence}`,
                        hasRepresentation && samePaths(paths, expected),
                        {
                            expectedCount: expected.length,
                            actualCount: entry.resultCount,
                            missingPaths: expected.filter(
                                (path) => !paths.includes(path)
                            ),
                            unexpectedPathSample: paths
                                .filter((path) => !expected.includes(path))
                                .slice(0, 10),
                        }
                    )
                }
                check(
                    `successful nonempty search: request ${entry.sequence}`,
                    hasRepresentation &&
                        paths.length > 0 &&
                        paths.every((path) => typeof path === 'string')
                )
                if (expected) {
                    check(
                        `bounded translated request: ${entry.sequence}`,
                        filter.startsWith('displayName:ilike:') &&
                            url.searchParams.get('fields') === 'path' &&
                            url.searchParams.get('order') === 'id:asc' &&
                            url.searchParams.get('paging') === 'true' &&
                            Number(url.searchParams.get('pageSize')) ===
                                fixture.pageSize &&
                            paths.length <= fixture.pageSize
                    )
                }
            }
        })
        request.on('after:response', () => {
            entry.deliveredAtMs = now()
            entry.elapsedMs = entry.deliveredAtMs - entry.startedAtMs
            if (entry.artificialDelay) {
                entry.holdMs = entry.deliveredAtMs - entry.backendResponseAtMs
            }
        })
        if (entry.artificialDelay) {
            request.continue(
                () =>
                    new Cypress.Promise((resolve) => {
                        heldResponse = entry
                        milestone('old real response held', {
                            sequence: entry.sequence,
                        })
                        releaseOld = () => {
                            clearTimeout(releaseTimer)
                            milestone('old real response released', {
                                sequence: entry.sequence,
                            })
                            resolve()
                        }
                        // Failure safety only: never silently pass if the newer response stalls.
                        releaseTimer = setTimeout(() => {
                            check(
                                'old response released intentionally before safety deadline',
                                false
                            )
                            releaseOld()
                        }, timeout * 4)
                    })
            )
        } else {
            request.continue()
        }
    })
}

Given('the live organisation unit search fixture is selected', () => {
    expect(Cypress.env('networkMode'), 'live traffic required').to.equal('live')
    expect(Cypress.env('ouSearchManifest'), 'manifest path').to.be.a('string')
    expect(Cypress.env('dhis2BaseUrl'), 'API base URL').to.be.a('string')
    expect(
        new URL(Cypress.env('dhis2BaseUrl')).username,
        'no URL credentials'
    ).to.equal('')
    expect(
        new URL(Cypress.env('dhis2BaseUrl')).password,
        'no URL credentials'
    ).to.equal('')
    const mode = Cypress.env('ouSearchMode') || 'assert'
    expect(mode).to.be.oneOf(['assert', 'observe'])
    started = performance.now()
    phase = 'setup'
    report = {
        author: 'Morten Svanæs',
        schemaVersion: 1,
        startedAt: new Date().toISOString(),
        mode,
        variant: Cypress.env('ouSearchVariant') || 'unspecified',
        fixtureVersion: 1,
        appUrl: Cypress.config('baseUrl'),
        apiUrl: Cypress.env('dhis2BaseUrl'),
        browser: {
            name: Cypress.browser.name,
            version: Cypress.browser.version,
        },
        timing: {
            debounceMs: 200,
            shortPauseMs: 350,
            rapidPauseMs: 0,
            keyDelayMs: 20,
            timeoutMs: timeout,
        },
        sizeDefinition:
            'jsonBytes is UTF-8 reserialized response body, not compressed transfer bytes; 304 has zero body bytes and reuses only a previously observed 200 representation at the exact URL; contentLengthHeader is separate',
        requests: [],
        milestones: [],
        checks: [],
    }
    heldResponse = undefined
    releaseOld = undefined
    oldTerm = undefined
    searchRepresentations = new Map()
    report.scenarioCompleted = false
    cy.readFile(Cypress.env('ouSearchManifest'), { log: false }).then(
        (manifest) => {
            expect(manifest.fixtureVersion).to.equal(1)
            fixture = manifest.client
            expect(
                Cypress.env('dhis2Username'),
                'fixture client login'
            ).to.equal(fixture.username)
            expect(fixture.pageSize).to.equal(50)
            expect(fixture.firstPagePaths).to.have.length(50)
            expect(fixture.secondPagePaths).to.have.length(50)
            expect(fixture.replacementPaths.length).to.be.within(1, 50)
            const paths = [
                ...fixture.firstPagePaths,
                ...fixture.secondPagePaths,
                ...fixture.replacementPaths,
            ]
            expect(
                paths.every((path) =>
                    fixture.orgUnits.some((unit) => unit.path === path)
                )
            ).to.equal(true)
            expect(
                new Set(fixture.orgUnits.map((unit) => unit.displayName)).size
            ).to.equal(fixture.orgUnits.length)
            report.fixture = {
                dataSetId: fixture.dataSetId,
                searchTerm: fixture.searchTerm,
                replacementTerm: fixture.replacementTerm,
                pageSize: fixture.pageSize,
                firstPagePaths: fixture.firstPagePaths,
                secondPagePaths: fixture.secondPagePaths,
                replacementPaths: fixture.replacementPaths,
            }
            recordTraffic()
            const baseUrl = Cypress.env('dhis2BaseUrl')
            cy.validateUserIsLoggedIn({ baseUrl, username: fixture.username })
            cy.request({
                url: `${baseUrl}/api/me?fields=username`,
                headers: { Origin: new URL(Cypress.config('baseUrl')).origin },
                log: false,
            }).then((response) => {
                expect(
                    response.body.username,
                    'fixture API must allow the app origin through CORS'
                ).to.equal(fixture.username)
            })
            // Selecting via supported bookmark state avoids assuming any demo dataset.
            cy.visitAndLoad(`/#/?dataSetId=${fixture.dataSetId}`, {
                onBeforeLoad(win) {
                    // loginByApi may run before the AUT origin exists. Restore the
                    // existing platform key on that origin, not the Cypress runner.
                    win.localStorage.setItem('DHIS2_BASE_URL', baseUrl)
                    // Core production builds default to "..", which takes precedence
                    // over localStorage. Use the shell's supported backend injection
                    // point so the identical build can target the supplied real API.
                    const meta =
                        win.document.querySelector(
                            'meta[name="dhis2-base-url"]'
                        ) || win.document.createElement('meta')
                    meta.name = 'dhis2-base-url'
                    meta.content = baseUrl
                    if (!meta.isConnected) {
                        win.document.head.prepend(meta)
                    }
                },
            })
            cy.get('[data-test="data-set-selector"]').should(
                'contain',
                fixture.dataSetName
            )
            cy.get('[data-test="org-unit-selector"] button').click()
            cy.get(input).should('be.visible')
            cy.then(() =>
                milestone('dataset selected and search opened', {
                    dataSetId: fixture.dataSetId,
                })
            )
        }
    )
})

When('I measure short input and the existing search debounce', () => {
    cy.then(() => {
        phase = 'short-input'
    })
    cy.get(input).type(fixture.searchTerm[0])
    pause(350)
    cy.then(() => {
        milestone('one character held above debounce')
        check('one character issues no search', searchRequests().length === 0)
    })
    cy.get(input).type(fixture.searchTerm[1])
    pause(350)
    cy.then(() => {
        milestone('two characters held above debounce')
        check('two characters issue no search', searchRequests().length === 0)
        phase = 'debounce'
    })
    // Three characters held above the already-existing 200 ms debounce.
    cy.get(input).type(fixture.searchTerm[2])
    pause(350)
    awaitResponse(fixture.searchTerm.slice(0, 3))
    cy.get(input).type(fixture.searchTerm.slice(3), { delay: 20 })
    cy.then(() => milestone('broad term typing completed'))
    awaitResponse(fixture.searchTerm)
    cy.then(() => {
        check(
            'one request for settled three-character prefix',
            forTerm(fixture.searchTerm.slice(0, 3)).length === 1
        )
        check(
            'one request for settled broad term',
            forTerm(fixture.searchTerm).length === 1
        )
        check(
            'sub-debounce intermediate character suppressed',
            forTerm(fixture.searchTerm.slice(0, 4)).length === 0
        )
    })
})

When('I inspect the bounded first page and use Next page', () => {
    inspectTree('first page visible', fixture.firstPagePaths)
    cy.then(() => {
        phase = 'pagination'
    })
    cy.get('body').then(($body) => {
        const $next = $body
            .find('button')
            .filter(
                (index, element) => element.textContent.trim() === 'Next page'
            )
        check(
            'actual Next page control available',
            $next.length === 1 && !$next.prop('disabled')
        )
        if ($next.length === 1 && !$next.prop('disabled')) {
            cy.wrap($next).click()
            cy.then(() => milestone('Next page clicked'))
            awaitResponse(fixture.searchTerm, 2)
            inspectTree('second page visible', fixture.secondPagePaths)
        } else {
            milestone('pagination unavailable; no simulated page request')
        }
    })
})

When('I rapidly replace the search term', () => {
    cy.then(() => {
        phase = 'rapid-replacement'
    })
    // One keyboard sequence avoids the actionability overhead between separate
    // get/clear/type commands, which can itself exceed the 200 ms debounce.
    cy.get(input).then(($input) => {
        const recordInput = (event) =>
            milestone('rapid input', { term: event.target.value })
        $input[0].addEventListener('input', recordInput)
        cy.wrap($input)
            .type(
                `{selectall}${fixture.replacementTerm}{selectall}${fixture.searchTerm}{selectall}${fixture.replacementTerm}`,
                { delay: 20 }
            )
            .then(() => {
                $input[0].removeEventListener('input', recordInput)
                milestone('rapid replacement typing completed')
            })
    })
    awaitResponse(fixture.replacementTerm)
    cy.then(() => {
        check(
            'rapid replacement issues only final term request',
            report.requests.filter(
                (request) =>
                    request.phase === 'rapid-replacement' && request.term
            ).length === 1
        )
    })
    inspectTree('rapid replacement visible', fixture.replacementPaths)
})

When(
    'an old real search response arrives after the replacement results',
    () => {
        cy.then(() => {
            phase = 'stale-response'
            // Case variants are equivalent for ilike, but are new client cache keys.
            oldTerm =
                fixture.searchTerm[0].toLowerCase() +
                fixture.searchTerm.slice(1).toUpperCase()
            newTerm =
                fixture.replacementTerm[0].toLowerCase() +
                fixture.replacementTerm.slice(1).toUpperCase()
        })
        cy.then(() => replace(oldTerm))
        poll('old request reached real backend', {
            readValue: () => Boolean(heldResponse),
            matches: Boolean,
        })
        cy.then(() => replace(newTerm))
        cy.then(() => awaitResponse(newTerm))
        // Prove the new result set is displayed before releasing the old response.
        // The full scroll/selection oracle runs after release; keeping a response
        // open during that traversal can exceed Cypress's response-handler deadline.
        cy.get('[data-test="org-unit-selector-tree"]')
            .parent()
            .scrollTo(0, 0, { ensureScrollable: false, duration: 0 })
        poll(
            'new results visible before old release',
            {
                readValue: visibleLabels,
                matches: (labels) => {
                    const oldOnly = fixture.firstPagePaths.filter(
                        (path) => !fixture.replacementPaths.includes(path)
                    )
                    return (
                        labels.includes(
                            labelFor(fixture.replacementPaths[0])
                        ) &&
                        oldOnly.every(
                            (path) => !labels.includes(labelFor(path))
                        )
                    )
                },
            },
            8000
        )
        cy.then(() => {
            if (releaseOld) {
                releaseOld()
                releaseOld = undefined
            }
        })
        cy.then(() => awaitResponse(oldTerm))
        pause(350)
        inspectTree(
            'new results remain after old delivery',
            fixture.replacementPaths
        )
        cy.then(() => {
            const newer = forTerm(newTerm).find(
                (request) => request.deliveredAtMs !== undefined
            )
            check(
                'real responses delivered in reversed order',
                heldResponse &&
                    newer &&
                    heldResponse.deliveredAtMs > newer.deliveredAtMs
            )
            milestone('stale-response observation completed')
        })
    }
)

const save = () => {
    report.completedAt = new Date().toISOString()
    report.summary = {
        requestCount: report.requests.length,
        searchRequestCount: searchRequests().length,
        undeliveredSearchCount: searchRequests().filter(
            (request) => request.deliveredAtMs === undefined
        ).length,
        failedContracts: report.checks
            .filter((item) => !item.passed)
            .map((item) => item.name),
        ordinarySearchJsonBytes: searchRequests()
            .filter((request) => !request.artificialDelay)
            .reduce((sum, request) => sum + (request.jsonBytes || 0), 0),
        artificiallyDelayedSearchCount: searchRequests().filter(
            (request) => request.artificialDelay
        ).length,
    }
    return cy.writeFile(
        Cypress.env('ouSearchOutput') || 'cypress/results/org-unit-search.json',
        report,
        { log: false }
    )
}

Then('I save the live search timeline and evaluate its contracts', () => {
    cy.get('body').then(($body) => {
        const path = fixture.replacementPaths[0]
        const $label = $body
            .find(labelSelector)
            .filter(
                (index, element) =>
                    element.textContent.trim() === labelFor(path)
            )
        check(
            'replacement result available for dataset selection',
            $label.length === 1
        )
        if ($label.length === 1) {
            cy.wrap($label).find('span').last().scrollIntoView().click()
            cy.url().then((url) => {
                const selected = new URLSearchParams(url.split('?')[1]).get(
                    'orgUnitId'
                )
                check(
                    'replacement result assigned to selected dataset',
                    selected === path.split('/').pop()
                )
                milestone('replacement organisation unit selected', {
                    selectedOrgUnitId: selected,
                })
            })
        }
    })
    cy.then(() => {
        report.scenarioCompleted = true
        check(
            'all search responses delivered',
            searchRequests().every(
                (request) => request.deliveredAtMs !== undefined
            )
        )
    })
    cy.then(save).then(() => {
        if (report.mode === 'assert') {
            expect(
                report.summary.failedContracts,
                'see JSON timeline for independent fixture mismatches'
            ).to.deep.equal([])
        }
    })
})

// Cucumber v16 queues After hooks inside the scenario; a failed Cypress command
// skips that queue. A native Mocha hook runs even when a scenario step fails.
afterEach(function () {
    if (releaseOld) {
        releaseOld()
        releaseOld = undefined
    }
    clearTimeout(releaseTimer)
    if (report) {
        report.testState = this.currentTest?.state || 'unknown'
        // Also retain the timeline when a setup, browser or strict assertion fails.
        return save()
    }
})
