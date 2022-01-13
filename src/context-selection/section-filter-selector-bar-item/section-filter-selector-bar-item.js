import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { MenuSelect } from '../menu-select/index.js'
import { useSectionFilter } from '../use-context-selection/index.js'
import useDataSetSectionsInfo from './use-data-set-sections-info.js'
import useOnDependentParamsChange from './use-on-dependent-params-change.js'
import useSelectorBarItemValue from './use-selector-bar-item-value.js'
import useShouldComponentRenderNull from './use-should-component-render-null.js'

export default function SectionFilterSelectorBarItem() {
    const [open, setOpen] = useState(false)
    const [sectionFilter, setSectionFilter] = useSectionFilter()
    const deselect = () => setSectionFilter(undefined)
    const dataSetSectionsInfo = useDataSetSectionsInfo()
    const loading = !dataSetSectionsInfo.called || dataSetSectionsInfo.loading
    const sectionFilterValue = useSelectorBarItemValue()

    useOnDependentParamsChange(deselect)

    const shouldComponentRenderNull = useShouldComponentRenderNull()
    if (shouldComponentRenderNull) {
        return null
    }

    const renderMenu =
        !dataSetSectionsInfo.loading &&
        !dataSetSectionsInfo.error &&
        dataSetSectionsInfo.data

    const selectableOptions = [
        { value: '', label: i18n.t('Show all sections') },
        ...(dataSetSectionsInfo.data?.sections || []),
    ]

    return (
        <SelectorBarItem
            disabled={loading || dataSetSectionsInfo.error}
            label={i18n.t('Section filter')}
            value={sectionFilterValue}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose a section filter')}
        >
            {renderMenu ? (
                <MenuSelect
                    values={selectableOptions}
                    selected={sectionFilter}
                    onChange={({ selected }) => {
                        setSectionFilter(selected)
                        setOpen(false)
                    }}
                />
            ) : (
                <div />
            )}
        </SelectorBarItem>
    )
}
