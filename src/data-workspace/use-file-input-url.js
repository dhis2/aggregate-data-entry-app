import { useConfig } from '@dhis2/app-runtime'

export default function useFileInputUrl(dataValueParams) {
    const { baseUrl } = useConfig()
    if (!dataValueParams) {
        return ''
    }

    const urlParams = new URLSearchParams(dataValueParams).toString()

    const fileUploadLink = `${baseUrl}/api/dataValues/files?${urlParams}`

    return fileUploadLink
}
