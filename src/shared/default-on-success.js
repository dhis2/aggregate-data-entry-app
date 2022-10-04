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
        // notify listeners
        // this sends paused mutations
        onlineManager.onOnline()
    }
}
