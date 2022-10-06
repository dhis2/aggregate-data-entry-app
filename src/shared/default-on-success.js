import { onlineManager } from '@tanstack/react-query'

export function defaultOnSuccess(callback) {
    if (typeof callback !== 'function') {
        return handleDefaultOnSuccess
    }
    return function composeSuccessHandlers(...args) {
        handleDefaultOnSuccess.apply(this, args)
        callback.apply(this, args)
    }
}

export function handleDefaultOnSuccess() {
    if (!onlineManager.isOnline()) {
        // reset to default online-implementation
        // this is done to move from 'offline' to 'online' whenever a request succeeds
        onlineManager.setOnline(undefined)
        // This is an undocumented method on onlineManager.
        // We do not want to setOnline(true), because then the onlineManager would not handle online/offline subscriptions.
        // Thus we use setOnline(undefined), which resets the onlineManager to the default handling of online/offline.
        // However, this does not fire online-event internally, so we do this manually
        // to start sending paused mutations whenever the first request succeeds.
        onlineManager.onOnline()
    }
}
