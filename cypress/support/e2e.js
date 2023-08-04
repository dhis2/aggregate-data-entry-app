import { enableAutoLogin, enableNetworkShim } from '@dhis2/cypress-commands'
import './get-selector-value-label-by-content.js'
import './visit-and-load.js'
import '@reportportal/agent-js-cypress/lib/commands/reportPortalCommands'

enableAutoLogin()
enableNetworkShim()
