import { Input } from '@dhis2/ui'
import React from 'react'
import i18n from '../locales'

export const FormSection = ({ children, section }) => {
    // Could potentially build table via props instead of rendering children
    const [filterText, setFilterText] = React.useState('')

    console.log('FormSection:', { section })

    return (
        <section className="wrapper">
            <header className="header">
                <div className="title">{section.displayName}</div>
                <div className="description">{section.description}</div>
            </header>
            <div className="filter">
                <Input
                    placeholder={i18n.t('Type here to filter in this section')}
                    value={filterText}
                    onChange={({ value }) => {
                        setFilterText(value)
                    }}
                />
            </div>
            {children}
            <style jsx>
                {`
                    .div {
                    }
                `}
            </style>
        </section>
    )
}

export const Sections = ({ children }) => {
    return children
}

export const Subsection = () => {}
