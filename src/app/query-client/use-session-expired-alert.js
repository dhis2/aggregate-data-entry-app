import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

export const useSessionExpiredAlert = () => {
    return useAlert(
        () =>
            i18n.t(
                'Session Expired. Please reload to log in again. You will not lose any data.'
            ),
        () => ({
            critical: true,

            message: i18n.t(
                'Session Expired. Please reload to log in again. You will not lose any data.'
            ),
            actions: [
                { label: 'Reload now', onClick: () => location.reload() },
            ],
        })
    )
}
