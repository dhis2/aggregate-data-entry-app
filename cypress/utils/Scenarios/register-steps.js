import * as commands from 'cypress-cucumber-preprocessor/steps'
import createStepHandler from './create-step-handler.js'

export default function registerSteps(state) {
    const registeredSteps = { Given: [], When: [], Then: [] }
    const handlers = {
        Given: createStepHandler(state, 'Given'),
        When: createStepHandler(state, 'When'),
        Then: createStepHandler(state, 'Then'),
    }

    // For each command type ("Given", "When" & "Then")
    Object.entries(state.stepDefinitions).forEach(
        ([commandName, commandScenarios]) => {
            // For each "Scenario"
            Object.entries(commandScenarios).forEach(([, steps]) => {
                // For each step definition
                Object.entries(steps).forEach(([stepDescription]) => {
                    // No need to register the same step definition twice
                    if (
                        registeredSteps[commandName].includes[stepDescription]
                    ) {
                        return
                    }

                    // Register step definition to prevent duplicate step definitions
                    registeredSteps[commandName].push(stepDescription)

                    // Use cypress-cucumber-preprocessor's step functions and
                    // supply our custom handler with the current scenario and step
                    // descriptions
                    commands[commandName](stepDescription, (...args) => {
                        const { currentScenario } = window.testState
                        const { name: scenarioDescription } = currentScenario

                        handlers[commandName]({
                            scenarioDescription,
                            stepDescription,
                            args,
                        })
                    })
                })
            })
        }
    )
}
