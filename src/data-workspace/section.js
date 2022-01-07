import { colors, IconFilter16, Button, InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useContext, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import styles from './section.module.css'
import { CategoryComboTable } from './category-combo-table.js'
import { MetadataContext } from './metadata-context.js'
import {
    getDataElementsBySection,
    groupDataElementsByCatCombo,
    groupDataElementsByCatComboInOrder,
} from './selectors.js'

export const FormSection = ({ section, getDataValue }) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = useState('')
    const { metadata } = useContext(MetadataContext)

    if (!Object.keys(metadata).length) {
        return 'Loading metadata'
    }

    const dataElements = getDataElementsBySection(
        metadata,
        section.dataSet.id,
        section.id
    )

    const groupedDataElements = section.disableDataElementAutoGroup
        ? groupDataElementsByCatComboInOrder(metadata, dataElements)
        : groupDataElementsByCatCombo(metadata, dataElements)

    return (
        <section className="wrapper">
            <header className="header">
                <div className="title">{section.displayName}</div>
                {section.description && (
                    <div className="description">
                        {section.description ||
                            'Placeholder section description'}
                    </div>
                )}
            </header>
            <div className="filter">
                <IconFilter16 color={colors.grey600} />
                <input
                    name="filter-input"
                    type="text"
                    placeholder={i18n.t('Type here to filter in this section')}
                    value={filterText}
                    onChange={({ target }) => setFilterText(target.value)}
                />
            </div>
            {groupedDataElements.map(({ categoryCombo, dataElements }) => (
                <CategoryComboTable
                    key={categoryCombo.id}
                    categoryCombo={categoryCombo}
                    dataElements={dataElements}
                    getDataValue={getDataValue}
                    filterText={filterText}
                />
            ))}

            {/* Todo: verify styles with joe - 
            line height for title & description, lack of focus styles on input,
            inset box shadow in title?, grey300 on section description */}
            <style jsx>
                {`
                    header {
                        background-color: ${colors.grey800};
                        line-height: 20px;
                        padding: 4px 8px;
                    }
                    .title {
                        color: ${colors.grey050};
                        font-weight: 500;
                        font-size: 14px;
                    }
                    .description {
                        color: ${colors.grey300};
                        font-size: 13px;
                        margin-top: 2px;
                    }
                    .filter {
                        display: flex;
                        align-items: center;
                        background-color: #fff;
                        font-size: 13px;
                        line-height: 15px;
                        padding: 8px;
                        gap: 8px;
                    }
                    .filter input {
                        width: 100%;
                        background: none;
                        border: none;
                        color: ${colors.grey900};
                    }
                    .filter input::placeholder {
                        color: ${colors.grey600};
                    }
                    .filter input:focus {
                        outline: none;
                    }
                `}
            </style>
        </section>
    )
}
FormSection.propTypes = {
    section: PropTypes.shape({
        description: PropTypes.string,
        disableDataElementAutoGroup: PropTypes.bool,
        displayName: PropTypes.string,
    }),
}

export const SectionForms = ({ dataSet, getDataValue }) => {
    const [globalFilter, setGlobalFilter] = useState('')

    return (
        <div>
            <FilterFields
                value={globalFilter}
                setFilterText={setGlobalFilter}
            />
            {dataSet.sections.map((s) => (
                <FormSection
                    section={s}
                    key={s.id}
                    getDataValue={getDataValue}
                />
            ))}
        </div>
    )
}

const FilterFields = ({ value, setFilterText }) => (
    <div className="filter">
        <InputField
            name="filter-input"
            className={styles.filterField}
            type="text"
            placeholder={i18n.t('Filter fields in all sections')}
            value={value}
            onChange={({ value }) => setFilterText(value)}
        />
        <Button secondary small name="Clear" onClick={() => setFilterText('')}>
            {i18n.t('Clear filter')}
        </Button>
        <style jsx>
            {`
                .filter {
                    display: flex;
                    align-items: center;
                    background-color: #fff;
                    font-size: 13px;
                    line-height: 15px;
                    padding: 8px;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .filter input {
                    width: 420px;
                    background: none;
                    color: ${colors.grey900};
                }
                .filter input::placeholder {
                    color: ${colors.grey600};
                }
                .filter input:focus {
                    outline: none;
                }
            `}
        </style>
    </div>
)
