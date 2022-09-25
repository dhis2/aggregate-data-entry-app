import i18n from '@dhis2/d2-i18n'
import { colors, Button, FileInput, IconAttachment16 } from '@dhis2/ui'
import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
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
    fieldname,
    form,
    image,
    deId,
    cocId,
    disabled,
    locked,
    onKeyDown,
    onFocus,
}) => {
    const { input, meta } = useField(fieldname, {
        // todo: validate
        subscription: {
            value: true,
            pristine: true,
            onFocus: true,
            onBlur: true,
            onChange: true,
        },
    })

    const dataValueParams = useDataValueParams({ deId, cocId })
    const fileLink = useFileInputUrl(dataValueParams)

    // When the app loads, if there's a file saved for this data value,
    // the value of this input will be UID of a file resource as populated
    // by the `dataValueSets` response. If that's the case, fetch some metadata
    // about the file to show in the entry form:
    const { data } = useQuery(
        // This endpoint doesn't support field filtering
        ['fileResources', { id: input.value }],
        {
            enabled:
                !!input.value &&
                meta.pristine &&
                typeof input.value === 'string',
        }
    )
    // const [deId, cocId] = [dataValueParams.de, dataValueParams.co]
    const { mutate: uploadFile } = useUploadFileDataValueMutation({
        deId,
        cocId,
    })
    const { mutate: deleteFile } = useDeleteDataValueMutation({ deId, cocId })

    const handleChange = ({ files }) => {
        const newFile = files[0]
        input.onChange({ name: newFile.name, size: newFile.size })
        input.onBlur()
        if (newFile instanceof File) {
            uploadFile(
                { file: newFile },
                {
                    onSuccess: () => {
                        form.mutators.setFieldData(fieldname, {
                            lastSyncedValue: newFile,
                        })
                    },
                }
            )
        }
    }

    const handleDelete = () => {
        input.onChange('')
        input.onBlur()
        deleteFile(null, {
            onSuccess: () => {
                form.mutators.setFieldData(fieldname, null)
            },
        })
    }

    const inputValueHasFileMeta = !!input.value.name && !!input.value.size
    const file = inputValueHasFileMeta
        ? input.value
        : data && input.value // i.e. if value is a resource UID, use fetched metadata
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
                            input.onFocus(...args)
                            onFocus?.(...args)
                        }}
                        onBlur={input.onBlur}
                        onKeyDown={onKeyDown}
                        disabled={disabled || locked}
                    >
                        {i18n.t('Delete')}
                    </Button>
                </>
            ) : (
                <FileInput
                    className={styles.fileInput}
                    name={input.name}
                    onChange={handleChange}
                    onFocus={(...args) => {
                        input.onFocus(...args)
                        onFocus?.(...args)
                    }}
                    onBlur={input.onBlur}
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

export const ImageInput = (props) => {
    return <FileResourceInput {...props} image />
}
