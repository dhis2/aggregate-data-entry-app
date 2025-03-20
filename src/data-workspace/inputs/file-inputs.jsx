import i18n from '@dhis2/d2-i18n'
import { colors, Button, FileInput, IconAttachment16 } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    useDataValueParams,
    useDeleteDataValueMutation,
    useUploadFileDataValueMutation,
} from '../../shared/index.js'
import useFileInputUrl from '../use-file-input-url.js'
import styles from './inputs.module.css'
import { InputPropTypes } from './utils.js'

const formatFileSize = (size) => {
    return `${(size / 1024).toFixed(2)} KB`
}

export const FileResourceInput = ({
    image,
    deId,
    cocId,
    disabled,
    locked,
    onKeyDown,
    onFocus,
    onBlur,
    initialValue,
    setValueSynced,
}) => {
    const [value, setValue] = useState(initialValue)
    const [lastSyncedValue, setLastSyncedValue] = useState(initialValue)
    const [syncTouched, setSyncTouched] = useState(false)

    useEffect(() => {
        if (syncTouched) {
            if (typeof value === 'string') {
                setValueSynced(value === lastSyncedValue)
            } else {
                setValueSynced(
                    value.name &&
                        value.name === lastSyncedValue?.name &&
                        value.size &&
                        value.size === lastSyncedValue?.size
                )
            }
        }
    }, [value, lastSyncedValue, syncTouched, setValueSynced])

    const dataValueParams = useDataValueParams({ deId, cocId })
    const fileLink = useFileInputUrl(dataValueParams)

    // When the app loads, if there's a file saved for this data value,
    // the value of this input will be UID of a file resource as populated
    // by the `dataValueSets` response. If that's the case, fetch some metadata
    // about the file to show in the entry form:
    const { data } = useQuery(
        // This endpoint doesn't support field filtering
        ['fileResources', { id: value }],
        {
            enabled: !!value && !syncTouched && typeof value === 'string',
        }
    )

    const { mutate: uploadFile } = useUploadFileDataValueMutation({
        deId,
        cocId,
    })
    const { mutate: deleteFile } = useDeleteDataValueMutation({ deId, cocId })

    const handleChange = ({ files }) => {
        const newFile = files[0]
        const newFileValue = { name: newFile.name, size: newFile.size }
        setSyncTouched(true)
        setValue(newFileValue)

        if (newFile instanceof File) {
            uploadFile(
                { file: newFile },
                {
                    onSuccess: () => {
                        setLastSyncedValue(newFileValue)
                        onBlur()
                    },
                }
            )
        }
    }

    const handleDelete = () => {
        setValue('')
        setSyncTouched(true)
        deleteFile(null, {
            onSuccess: () => {
                setLastSyncedValue('')
                onBlur()
            },
        })
    }

    const inputValueHasFileMeta =
        typeof value !== 'string' && value?.name && value?.size
    const file = inputValueHasFileMeta
        ? value
        : data && value // i.e. if value is a resource UID, use fetched metadata
        ? {
              name: data.name,
              size: data.contentLength,
          }
        : null

    // styles:
    // todo: make file input button `secondary` style to match design spec
    return (
        <div className={styles.fileInputWrapper} onClick={onFocus}>
            {file ? (
                <>
                    <IconAttachment16 color={colors.grey700} />
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={fileLink}
                        className={styles.fileLink}
                    >
                        {file.name}
                    </a>
                    {` (${formatFileSize(file.size)})`}
                    <Button
                        small
                        secondary
                        className={styles.deleteFileButton}
                        onClick={handleDelete}
                        onFocus={(...args) => {
                            onFocus?.(...args)
                        }}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        disabled={disabled || locked}
                    >
                        {i18n.t('Delete')}
                    </Button>
                </>
            ) : (
                <FileInput
                    className={styles.fileInput}
                    onChange={handleChange}
                    onFocus={(...args) => {
                        onFocus?.(...args)
                    }}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    small
                    buttonLabel={
                        image
                            ? i18n.t('Upload an image')
                            : i18n.t('Upload a file')
                    }
                    disabled={disabled || locked}
                />
            )}
        </div>
    )
}

FileResourceInput.propTypes = {
    ...InputPropTypes,
    image: PropTypes.bool,
}
