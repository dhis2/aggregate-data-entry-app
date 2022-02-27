// todo: use RQ
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors, Button, FileInput, IconAttachment16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import { InputPropTypes } from './inputs.js'
import styles from './inputs.module.css'

// This endpoint doesn't support field filtering
const FILE_META_QUERY = {
    fileResource: {
        resource: 'fileResources',
        id: ({ id }) => id,
    },
}
// Need to do two-step process due to api/dataValues/file limitations
// (see usage below)
// https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data.html#webapi_sending_individual_data_values
const UPLOAD_FILE_MUTATION = {
    resource: 'dataValues/file',
    type: 'create',
    data: (data) => data,
}
const DELETE_FILE_MUTATION = {
    resource: 'dataValues',
    type: 'delete',
    params: (params) => params,
}

const getFileSize = (file) => {
    return `${(file.size / 1024).toFixed(2)} KB`
}

export const FileResourceInput = ({
    name,
    syncData,
    lastSyncedValue,
    onKeyDown,
    image,
    getDataValueParams,
}) => {
    const { input, meta } = useField(name, {
        // todo: pick one of pristine or dirty
        subscription: {
            value: true,
            inital: true,
            pristine: true,
            onFocus: true,
            onBlur: true,
            onChange: true,
        },
    })
    const [file, setFile] = React.useState()
    // todo: use reactQuery
    const {
        loading: fileMetaLoading,
        error: fileMetaError,
        refetch: getFileMeta,
    } = useDataQuery(FILE_META_QUERY, {
        lazy: true,
        onComplete: ({ fileResource }) => {
            setFile({
                name: fileResource.name,
                size: fileResource.contentLength,
            })
        },
    })
    const [uploadFile, { loading: uploading }] =
        useDataMutation(UPLOAD_FILE_MUTATION)
    const [deleteFile] = useDataMutation(DELETE_FILE_MUTATION)

    React.useEffect(() => {
        // If a file is already stored for this data value, fetch some metadata
        // (input.value will be populated with a fileResource UID)
        if (input.value && typeof input.value === 'string') {
            getFileMeta({ id: input.value })
        }
    }, [])

    // todo: handle data value sets weirdness?

    const handleChange = ({ files }) => {
        const newFile = files[0]
        console.log({ newFile })
        setFile(newFile)
        input.onChange(newFile)
        input.onBlur()
        if (newFile instanceof File) {
            // todo: need to optimistically update RQ cache
            uploadFile({ file: newFile, ...getDataValueParams() })
            // todo: set sync status; update lastSyncedValue
        }
    }

    const handleDelete = () => {
        setFile(null)
        input.onChange('')
        input.onBlur()
        deleteFile(getDataValueParams())
        // todo: need to optimistically update RQ cache
        // todo: set sync status; update lastSyncedValue
    }

    // styles:
    // todo: make file input button `secondary` style to match design spec
    // todo: make file summary a clickable link to view the file (focusable)
    return (
        <div className={styles.fileInputWrapper} onKeyDown={onKeyDown}>
            {file ? (
                <>
                    <IconAttachment16 color={colors.grey700} />
                    {`${file.name} (${getFileSize(file)})`}
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
FileResourceInput.propTypes = InputPropTypes

export const ImageInput = (props) => {
    return <FileResourceInput {...props} image />
}
