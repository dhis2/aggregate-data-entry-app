import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { MenuSelect } from '../menu-select/index.js'
import { useSectionFilter } from '../use-context-selection.js'
import {
    useDeselectOnCocChange,
    useDeselectOnDataSetChange,
    useDeselectOnOrgUnitChange,
    useDeselectOnPeriodChange,
} from '../use-deselect/index.js'
import useDataSetSectionsInfo from './use-data-set-sections-info.js'

export default function SectionFilterSelectorBarItem() {
    const [open, setOpen] = useState(false)
    const [sectionFilter, setSectionFilter] = useSectionFilter()
    const deselect = () => setSectionFilter('')
    const {
        calledDataSetSectionsInfo,
        loadingDataSetSectionsInfo,
        errorDataSetSectionsInfo,
        dataSetSectionsInfo,
    } = useDataSetSectionsInfo()

    const loading = !calledDataSetSectionsInfo || loadingDataSetSectionsInfo

    const sectionFilterValue = !sectionFilter
        ? undefined
        : loading
        ? i18n.t('Fetching data set info')
        : errorDataSetSectionsInfo
        ? i18n.t('Error occurred while loading data set info')
        : dataSetSectionsInfo?.sections.find(({ id }) => id === sectionFilter)
              ?.displayName

    useDeselectOnCocChange(deselect)
    useDeselectOnDataSetChange(deselect)
    useDeselectOnOrgUnitChange(deselect)
    useDeselectOnPeriodChange(deselect)

    if (
        loading ||
        errorDataSetSectionsInfo ||
        'SECTION' !== dataSetSectionsInfo?.formType ||
        dataSetSectionsInfo?.sections.length === 0
    ) {
        return null
    }

    const selectableSections = dataSetSectionsInfo?.sections.map(
        ({ id, displayName }) => ({
            value: id,
            label: displayName,
        })
    )

    return (
        <SelectorBarItem
            disabled={loading || errorDataSetSectionsInfo}
            label={i18n.t('Section filter')}
            value={sectionFilterValue}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose a section filter')}
        >
            {selectableSections && (
                <MenuSelect
                    values={selectableSections}
                    selected={sectionFilter}
                    onChange={({ selected }) => {
                        setSectionFilter(selected)
                        setOpen(false)
                    }}
                />
            )}
        </SelectorBarItem>
    )
}
