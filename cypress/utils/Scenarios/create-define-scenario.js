export default function createDefineScenario(state) {
    return function defineScenario(scenarioDescription, defineSteps) {
        const Given = (step, stepCallback) => {
            !state.stepDefinitions.Given[scenarioDescription] &&
                (state.stepDefinitions.Given[scenarioDescription] = {})
            state.stepDefinitions.Given[scenarioDescription][step] =
                stepCallback
        }

        const When = (step, stepCallback) => {
            !state.stepDefinitions.When[scenarioDescription] &&
                (state.stepDefinitions.When[scenarioDescription] = {})
            state.stepDefinitions.When[scenarioDescription][step] = stepCallback
        }

        const Then = (step, stepCallback) => {
            !state.stepDefinitions.Then[scenarioDescription] &&
                (state.stepDefinitions.Then[scenarioDescription] = {})
            state.stepDefinitions.Then[scenarioDescription][step] = stepCallback
        }

        const Before = (beforeCallback) => {
            state.hooks.Before[scenarioDescription] = beforeCallback
        }

        const After = (afterCallback) => {
            state.hooks.After[scenarioDescription] = afterCallback
        }

        const BeforeEach = (beforeEachCallback) => {
            state.hooks.BeforeEach[scenarioDescription] = beforeEachCallback
        }

        const AfterEach = (afterEachCallback) => {
            state.hooks.AfterEach[scenarioDescription] = afterEachCallback
        }

        defineSteps({ Given, When, Then, Before, After, BeforeEach, AfterEach })
    }
}
