// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental' // ToDo: find out why /experimental causes lint and jest issues
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import useDataSetAdditionalInfo from '../../context-selection/section-filter-selector-bar-item/use-data-set-additional-info.js'
import useCustomForm from '../../custom-forms/use-custom-form.js'
import useSetRightHandPanel from '../../right-hand-panel/use-show-right-hand-panel.js'
import {
    dataDetailsSidebarId,
    useContextSelection,
    useHighlightedFieldStore,
    useIsReadOnly,
    useLockedContext,
    useMetadata,
    useSetDataValueMutation,
    useValueStore,
} from '../../shared/index.js'
import styles from './custom-form.module.css'
import { parseHtmlToReact } from './parse-html-to-react.jsx'
import useCustomFormFileHelper from './use-custom-form-file-helper.js'

const defaultMutation = {}
/**
 * This implementation of custom forms only supports custom
 * HTML and CSS. It does not support custom logic (JavaScript).
 * For more info see ./docs/custom-froms.md
 */
export const CustomForm = ({ dataSet }) => {
    const { data: dataSetInfo } = useDataSetAdditionalInfo()
    const { data: customForm } = useCustomForm({
        id: dataSet.id,
        version: dataSet.version,
    })

    const { locked } = useLockedContext()
    const readOnly = useIsReadOnly()

    const getDataValues = useValueStore((state) => state.getDataValues)
    const initialDataValues = React.useMemo(
        () => getDataValues(),
        [getDataValues]
    )
    const { data: metadata } = useMetadata()
    const [{ dataSetId, orgUnitId, periodId, attributeOptionComboSelection }] =
        useContextSelection()

    const setHighlightedField = useHighlightedFieldStore(
        (state) => state.setHighlightedField
    )

    const setRightHandPanel = useSetRightHandPanel()
    const showDetailsBar = React.useCallback(() => {
        setRightHandPanel(dataDetailsSidebarId)
    }, [setRightHandPanel])

    const { mutate } = useSetDataValueMutation(defaultMutation)

    const fileHelper = useCustomFormFileHelper()

    const allFuncs = React.useMemo(() => [], [])
    const sync = React.useCallback(
        (updatedValue, options) => {
            // ! We need to manually keep a list of the updated fields for when an offline form comes online
            // ! otherwise, only the last field state is updated (turned green). This is different from the
            // ! standard forms as these get re-rendered on sync, and the affected fields updated.
            if (options?.onSuccess) {
                allFuncs.push(options.onSuccess)
            }
            mutate(updatedValue, {
                onSuccess: () => {
                    let func = allFuncs.pop()
                    while (func) {
                        func?.()
                        func = allFuncs.pop()
                    }
                },
                onError: options?.onError,
            })
        },
        [allFuncs, mutate]
    )

    const formContent = customForm?.form

    if (!formContent || !dataSetInfo) {
        return null
    }

    const useModernRendering =
        !formContent?.match('<script') &&
        !formContent?.match('<!-- NO_MODERN_HTML_ONLY_RENDERING -->')

    if (useModernRendering) {
        return (
            <div className={styles.customForm}>
                {parseHtmlToReact(
                    dataSetInfo?.dataEntryForm?.htmlCode,
                    metadata
                )}
            </div>
        )
    } else if (readOnly) {
        // the form's scripts load and save values themselves, so it can't
        // show values it is given, e.g. a report's
        return (
            <NoticeBox
                title={i18n.t('This custom form cannot be shown read-only')}
            >
                {i18n.t(
                    'The form runs its own scripts, which load and save data values directly.'
                )}
            </NoticeBox>
        )
    } else {
        return (
            <Plugin
                width="100%"
                pluginSource="plugin.html"
                htmlCode={formContent}
                initialValues={initialDataValues}
                metadata={metadata}
                dataSet={dataSet}
                saveValue={sync}
                dataSetId={dataSetId}
                orgUnitId={orgUnitId}
                periodId={periodId}
                attributeOptionComboSelection={attributeOptionComboSelection}
                setHighlightedField={setHighlightedField}
                showDetailsBar={showDetailsBar}
                fileHelper={fileHelper}
                style={dataSetInfo?.dataEntryForm?.style}
                locked={locked}
            />
        )
    }
}

CustomForm.propTypes = {
    dataSet: PropTypes.shape({
        id: PropTypes.string,
        version: PropTypes.number,
    }),
}
