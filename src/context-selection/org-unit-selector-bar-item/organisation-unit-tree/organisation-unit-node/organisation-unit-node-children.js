import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { isPathIncluded } from '../helpers/index.js'
import { orgUnitPathPropType, orgUnitPropType } from '../prop-types.js'
import { LoadingSpinner } from './loading-spinner.js'

const getFilteredChildren = ({ nodes, filter, parentPath }) => {
    if (!filter?.length) {
        return nodes
    }

    return nodes.filter((child) => {
        return isPathIncluded(filter, `${parentPath}/${child.id}`)
    })
}

export const OrganisationUnitNodeChildren = ({
    autoExpandLoadingError,
    nodes,
    dataTest,
    disableSelection,
    show,
    error,
    expanded,
    filter,
    highlighted,
    isUserDataViewFallback,
    offlineLevels,
    prefetchedOrganisationUnits,
    loading,
    onChange,
    onChildrenLoaded,
    onCollapse,
    onExpand,
    OrganisationUnitNode,
    parentPath,
    renderNodeLabel,
    rootId,
    selected,
    singleSelection,
    suppressAlphabeticalSorting,
}) => {
    const filteredChildren = show
        ? getFilteredChildren({ nodes, filter, parentPath })
        : []

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && `Error: ${error}`}
            {show &&
                filteredChildren.length === 0 &&
                i18n.t('No children match filter')}

            {show &&
                filteredChildren.length > 0 &&
                filteredChildren.map((child) => (
                    <OrganisationUnitNode
                        autoExpandLoadingError={autoExpandLoadingError}
                        childCount={child.children}
                        dataTest={dataTest}
                        disableSelection={disableSelection}
                        displayName={child.displayName}
                        expanded={expanded}
                        filter={filter}
                        highlighted={highlighted}
                        id={child.id}
                        isUserDataViewFallback={isUserDataViewFallback}
                        key={child.path}
                        onChange={onChange}
                        onChildrenLoaded={onChildrenLoaded}
                        onCollapse={onCollapse}
                        onExpand={onExpand}
                        path={child.path}
                        renderNodeLabel={renderNodeLabel}
                        rootId={rootId}
                        selected={selected}
                        singleSelection={singleSelection}
                        suppressAlphabeticalSorting={
                            suppressAlphabeticalSorting
                        }
                        level={child.level}
                        offlineLevels={offlineLevels}
                        prefetchedOrganisationUnits={
                            prefetchedOrganisationUnits
                        }
                    />
                ))}
        </>
    )
}

OrganisationUnitNodeChildren.propTypes = {
    // Prevent cirular imports
    OrganisationUnitNode: PropTypes.func.isRequired,
    dataTest: PropTypes.string.isRequired,
    parentPath: PropTypes.string.isRequired,
    renderNodeLabel: PropTypes.func.isRequired,
    rootId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,

    autoExpandLoadingError: PropTypes.bool,
    disableSelection: PropTypes.bool,
    error: PropTypes.string,
    expanded: PropTypes.arrayOf(orgUnitPathPropType),
    filter: PropTypes.arrayOf(orgUnitPathPropType),
    highlighted: PropTypes.arrayOf(orgUnitPathPropType),
    isUserDataViewFallback: PropTypes.bool,
    loading: PropTypes.bool,
    nodes: PropTypes.arrayOf(orgUnitPropType),
    offlineLevels: PropTypes.number,
    prefetchedOrganisationUnits: PropTypes.arrayOf(orgUnitPropType),
    selected: PropTypes.arrayOf(orgUnitPathPropType),
    show: PropTypes.bool,
    singleSelection: PropTypes.bool,
    suppressAlphabeticalSorting: PropTypes.bool,

    onChildrenLoaded: PropTypes.func,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
}
