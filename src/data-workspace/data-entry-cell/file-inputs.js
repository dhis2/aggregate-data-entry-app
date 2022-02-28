// todo: use RQ
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors, Button, FileInput, IconAttachment16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useField } from 'react-final-form'
import styles from './inputs.module.css'

// This endpoint doesn't support field filtering
const FILE_META_QUERY = {
    fileResource: {
        resource: 'fileResources',
        id: ({ id }) => id,
    },
}
const UPLOAD_FILE_MUTATION = {
    resource: 'dataValues/file',
    type: 'create',
    data: (data) => data,
}
// This needs to be used for file-type data values; sending an empty 'value' prop
// doesn't work to clear the file
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
    onKeyDown,
    image,
    getDataValueParams,
    setIsFileLoading,
    setIsFileSynced,
}) => {
    const { input, meta } = useField(name, {
        subscription: {
            value: true,
            // inital: true, // not working for some reason
            pristine: true,
            onFocus: true,
            onBlur: true,
            onChange: true,
        },
    })
    const [file, setFile] = React.useState()
    // todo: use reactQuery
    const {
        // loading: fileMetaLoading,
        // error: fileMetaError,
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
    const [uploadFile] = useDataMutation(UPLOAD_FILE_MUTATION, {
        onComplete: () => {
            setIsFileLoading(false)
            setIsFileSynced(true)
        },
    })
    const [deleteFile] = useDataMutation(DELETE_FILE_MUTATION, {
        onComplete: () => {
            setIsFileLoading(false)
            setIsFileSynced(true)
        },
    })

    React.useEffect(() => {
        // If a file is already stored for this data value, fetch some metadata
        // (input.value will be populated with a fileResource UID)
        if (input.value && typeof input.value === 'string' && meta.pristine) {
            // todo: this fires once if there's stale data, getting a 404
            getFileMeta({ id: input.value })
        }
    }, [input.value])

    // todo: handle data value sets weirdness?

    const handleChange = ({ files }) => {
        const newFile = files[0]
        setFile(newFile)
        input.onChange(newFile)
        input.onBlur()
        if (newFile instanceof File) {
            // todo: optimistically update RQ cache
            setIsFileLoading(true)
            setIsFileSynced(false)
            uploadFile({ file: newFile, ...getDataValueParams() })
        }
    }

    const handleDelete = () => {
        setFile(null)
        input.onChange('')
        input.onBlur()
        setIsFileSynced(false)
        setIsFileLoading(true)
        // todo: optimistically update RQ cache
        deleteFile(getDataValueParams())
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
FileResourceInput.propTypes = {
    getDataValueParams: PropTypes.func,
    image: PropTypes.bool,
    name: PropTypes.string,
    setIsFileLoading: PropTypes.func,
    setIsFileSynced: PropTypes.func,
    onKeyDown: PropTypes.func,
}

export const ImageInput = (props) => {
    return <FileResourceInput {...props} image />
}
