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
        onlineManager.setOnline(true)
    }
}
