import i18n from '@dhis2/d2-i18n'
import { colors, Button, FileInput, IconAttachment16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { useQuery } from 'react-query'
import {
    MUTATION_TYPES,
    useDataValueMutation,
} from '../data-entry-cell/use-data-value-mutation.js'
import styles from './inputs.module.css'

const formatFileSize = (size) => {
    return `${(size / 1024).toFixed(2)} KB`
}

export const FileResourceInput = ({
    name,
    image,
    getDataValueParams,
    setIsFileSynced,
}) => {
    const { input, meta } = useField(name, {
        subscription: {
            value: true,
            pristine: true,
            onFocus: true,
            onBlur: true,
            onChange: true,
        },
    })
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
    const { mutate: uploadFile } = useDataValueMutation(
        MUTATION_TYPES.FILE_UPLOAD
    )
    const { mutate: deleteFile } = useDataValueMutation(MUTATION_TYPES.DELETE)

    const handleChange = ({ files }) => {
        const newFile = files[0]
        input.onChange({ name: newFile.name, size: newFile.size })
        input.onBlur()
        if (newFile instanceof File) {
            setIsFileSynced(false)
            uploadFile(
                {
                    file: newFile,
                    ...getDataValueParams(),
                },
                {
                    onSuccess: () => {
                        setIsFileSynced(true)
                    },
                }
            )
        }
    }

    const handleDelete = () => {
        input.onChange('')
        input.onBlur()
        setIsFileSynced(false)
        deleteFile(getDataValueParams(), {
            onSuccess: () => {
                setIsFileSynced(true)
            },
        })
    }

    const inputValueHasFileMeta = !!input.value.name && !!input.value.size
    const file = inputValueHasFileMeta
        ? input.value
        : data && input.value // i.e. if value is a resource UID
        ? {
              name: data.name,
              size: data.contentLength,
          }
        : null

    // styles:
    // todo: make file input button `secondary` style to match design spec
    // todo: make file summary a clickable link to view the file (focusable)
    return (
        <div className={styles.fileInputWrapper}>
            {file ? (
                <>
                    <IconAttachment16 color={colors.grey700} />
                    {`${file.name} (${formatFileSize(file.size)})`}
                    <Button
                        small
                        secondary
                        className={styles.deleteFileButton}
                        onClick={handleDelete}
                        onFocus={input.onFocus}
                        onBlur={input.onBlur}
                    >
                        {i18n.t('Delete')}
                    </Button>
                </>
            ) : (
                <FileInput
                    className={styles.fileInput}
                    name={input.name}
                    onChange={handleChange}
                    onFocus={input.onFocus}
                    onBlur={input.onBlur}
                    small
                    buttonLabel={
                        image
                            ? i18n.t('Upload an image')
                            : i18n.t('Upload a file')
                    }
                />
            )}
        </div>
    )
}
FileResourceInput.propTypes = {
    getDataValueParams: PropTypes.func,
    image: PropTypes.bool,
    name: PropTypes.string,
    setIsFileSynced: PropTypes.func,
}

export const ImageInput = (props) => {
    return <FileResourceInput {...props} image />
}
