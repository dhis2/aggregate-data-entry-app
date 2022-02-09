import i18n from '@dhis2/d2-i18n'
import React from 'react'
import ToggleableUnit from '../toggleable-unit.js'
import styles from './contextual-help.module.css'

const CellReference = () => (
    <ToggleableUnit
        title={i18n.t('Cell reference')}
        initiallyOpen
    ></ToggleableUnit>
)

export default CellReference
