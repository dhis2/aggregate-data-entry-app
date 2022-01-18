export default function createEmptyState() {
    return {
        stepDefinitions: {
            Given: {},
            When: {},
            Then: {},
        },
        hooks: {
            Before: {},
            After: {},
            BeforeEach: {},
            AfterEach: {},
        },
    }
}
