import createDefineScenario from './create-define-scenario.js'
import createEmptyState from './create-empty-state.js'
import registerBeforeAndAfterHooks from './register-before-and-after-hooks.js'
import registerSteps from './register-steps.js'

export default function Scenarios(defineScenarios) {
    const state = createEmptyState()
    const defineScenario = createDefineScenario(state)

    defineScenarios(defineScenario)
    registerBeforeAndAfterHooks(state)
    registerSteps(state)
}
