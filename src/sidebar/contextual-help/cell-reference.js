import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import ToggleableUnit from '../toggleable-unit.js'
import styles from './cell-reference.module.css'
import Cell from './cell.js'

const CellExample = ({ name, state }) => (
    <div className={styles.helpItem}>
        <div>{name}</div>
        <div>
            <Cell value="10" state={state} />
        </div>
    </div>
)

CellExample.propTypes = {
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
}

const CellReference = () => (
    <ToggleableUnit title={i18n.t('Cell reference')} initiallyOpen>
        <CellExample
            name={i18n.t('Saved and synced to server')}
            state="SYNCED"
        />
        <Divider />
        <CellExample
            name={i18n.t('Waiting to sync, saved locally')}
            state="LOADING"
        />
        <Divider />
        <CellExample
            name={i18n.t('Data item has a comment')}
            state="HAS_COMMENT"
        />
        <Divider />
        <CellExample
            name={i18n.t('Invalid value, not saved')}
            state="INVALID"
        />
        <Divider />
        <CellExample name={i18n.t('Locked, not editable')} state="LOCKED" />
    </ToggleableUnit>
)

export default CellReference
