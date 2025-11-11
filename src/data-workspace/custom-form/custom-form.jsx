// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental' // ToDo: find out why /experimental causes lint and jest issues
import PropTypes from 'prop-types'
import React from 'react'
import useCustomForm from '../../custom-forms/use-custom-form.js'
import {
    useContextSelection,
    useHighlightedFieldStore,
    useMetadata,
    useSetDataValueMutation,
    useValueStore,
} from '../../shared/index.js'

const defaultMutation = {}
/**
 * This implementation of custom forms only supports custom
 * HTML and CSS. It does not support custom logic (JavaScript).
 * For more info see ./docs/custom-froms.md
 */
export const CustomForm = ({ dataSet }) => {
    const { data: customForm } = useCustomForm({
        id: dataSet.id,
        version: dataSet.version,
    })

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

    const { mutate } = useSetDataValueMutation(defaultMutation)

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

    return customForm ? (
        <>
            <Plugin
                width="100%"
                pluginSource="plugin.html"
                htmlCode={customForm.form}
                initialValues={initialDataValues}
                metadata={metadata}
                dataSet={dataSet}
                saveValue={sync}
                dataSetId={dataSetId}
                orgUnitId={orgUnitId}
                periodId={periodId}
                attributeOptionComboSelection={attributeOptionComboSelection}
                setHighlightedField={setHighlightedField}
            />
            {/* <div className={styles.customForm}>
                <h2>Existing custom form functionality (for reference)</h2>
                {parseHtmlToReact(customForm.htmlCode, metadata)}
            </div> */}
        </>
    ) : null
}

CustomForm.propTypes = {
    dataSet: PropTypes.shape({
        id: PropTypes.string,
        version: PropTypes.number,
    }),
}
