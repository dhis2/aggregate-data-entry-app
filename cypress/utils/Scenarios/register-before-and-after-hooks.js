import { Before, After } from 'cypress-cucumber-preprocessor/steps'

export default function registerBeforeAndAfterHooks(state) {
    Before(() => {
        const { currentScenario } = window.testState
        const { name: scenarioDescription } = currentScenario
        const callback = state.hooks.Before[scenarioDescription]
        callback && callback()
    })

    After(() => {
        const { currentScenario } = window.testState
        const { name: scenarioDescription } = currentScenario
        const callback = state.hooks.After[scenarioDescription]
        callback && callback()
    })
}
