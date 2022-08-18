/**
 * Initialise a Date instance with Date.now() for Jest mocking.
 * This can be removed once we upgrade Jest to a verion which
 * supports `jest.setSystemTime`.
 */
export default function getCurrentDate() {
    return new Date(Date.now())
}
