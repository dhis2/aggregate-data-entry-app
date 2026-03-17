import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import {
    useDeleteDataValueMutation,
    useUploadFileDataValueMutation,
} from '../../shared/index.js'

function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[arr.length - 1])

    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}

const defaultMutation = {}

const useCustomFormFileHelper = () => {
    const queryClient = useQueryClient()
    const { mutate: uploadFileMutate } =
        useUploadFileDataValueMutation(defaultMutation)

    const { mutate: mutateDeleteFile } =
        useDeleteDataValueMutation(defaultMutation)

    const uploadFile = useCallback(
        (base64File, { fileName, dataValueParams, onSuccess }) => {
            const file = dataURLtoFile(base64File, fileName)

            uploadFileMutate(
                { ...dataValueParams, file },
                {
                    onSuccess: onSuccess,
                }
            )
        },
        [uploadFileMutate]
    )

    const loadFileMetadata = useCallback(
        async (id) => {
            const data = await queryClient.fetchQuery([`fileResources/${id}`], {
                params: { id },
            })
            return data
        },
        [queryClient]
    )

    const deleteFile = useCallback(
        (dataValue, { onSuccess }) => {
            mutateDeleteFile(
                { ...dataValue },
                {
                    onSuccess,
                }
            )
        },
        [mutateDeleteFile]
    )

    const fileHelper = useMemo(
        () => ({ uploadFile, loadFileMetadata, deleteFile }),
        [uploadFile, loadFileMetadata, deleteFile]
    )

    return fileHelper
}

export default useCustomFormFileHelper
