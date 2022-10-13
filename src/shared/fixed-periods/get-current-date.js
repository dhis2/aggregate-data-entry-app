/**
 * Initialise a Date instance with Date.now() for Jest mocking.
 */
export default function getCurrentDate() {
    const currentDate = new Date(Date.now())

    // This will ensure that there's no rounding issue when calculating the
    // offset to the server time
    currentDate.setMilliseconds(0)

    return currentDate
}
