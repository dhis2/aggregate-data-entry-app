export default function createStepHandler(state, commandName) {
    return ({ scenarioDescription, stepDescription, args }) => {
        const beforeEachHandler = state.hooks.BeforeEach[scenarioDescription]
        const afterEachHandler = state.hooks.AfterEach[scenarioDescription]
        beforeEachHandler && beforeEachHandler()
        state.stepDefinitions[commandName][scenarioDescription][stepDescription](...args)
        afterEachHandler && afterEachHandler()
    }
}
