import i18n from '@dhis2/d2-i18n'
import { Node } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { leftTrimToRootId } from '../helpers/index.js'
import { orgUnitPathPropType, orgUnitPropType } from '../prop-types.js'
import { ErrorMessage } from './error-message.jsx'
import { hasDescendantSelectedPaths } from './has-descendant-selected-paths.js'
import { Label } from './label/index.js'
import { LoadingSpinner } from './loading-spinner.jsx'
import { OrganisationUnitNodeChildren } from './organisation-unit-node-children.jsx'
import { useOpenState } from './use-open-state.js'
import { useOrgChildren } from './use-org-children.js'

export const OrganisationUnitNode = ({
    autoExpandLoadingError,
    childCount,
    dataTest,
    disableSelection,
    displayName,
    expanded,
    highlighted,
    id,
    isUserDataViewFallback,
    level,
    offlineLevels,
    path,
    prefetchedOrganisationUnits,
    renderNodeLabel,
    rootId,
    selected,
    singleSelection,
    filter,
    suppressAlphabeticalSorting,
    onChange,
    onChildrenLoaded,
    onCollapse,
    onExpand,
}) => {
    const strippedPath = leftTrimToRootId(path, rootId)
    const node = {
        // guarantee that displayName and id are avaiable before data loaded
        displayName,
        id,
        // do not override strippedPath with path from loaded data
        path: strippedPath,
        childCount,
        level,
    }
    const { show, loading, error, nodes, fetch } = useOrgChildren({
        node,
        suppressAlphabeticalSorting,
        onComplete: onChildrenLoaded,
        offlineLevels,
        prefetchedOrganisationUnits,
    })
    const hasChildren = childCount > 0

    const hasSelectedDescendants = hasDescendantSelectedPaths(
        strippedPath,
        selected,
        rootId
    )
    const isHighlighted = highlighted.includes(path)
    const { open, onToggleOpen } = useOpenState({
        autoExpandLoadingError,
        errorMessage: error && error.toString(),
        path: strippedPath,
        expanded,
        onExpand,
        onCollapse,
    })

    const isSelected = !!selected.find((curPath) =>
        curPath.match(new RegExp(`${strippedPath}$`))
    )

    const labelContent = renderNodeLabel({
        disableSelection,
        childCount,
        hasSelectedDescendants,
        selected,
        open,
        path,
        singleSelection,
        node,
        label: displayName,
        checked: isSelected,
        highlighted: isHighlighted,
    })

    const label = (
        <Label
            node={node}
            fullPath={path}
            open={open}
            loading={loading}
            checked={isSelected}
            rootId={rootId}
            onChange={onChange}
            dataTest={`${dataTest}-label`}
            selected={selected}
            hasChildren={hasChildren}
            highlighted={isHighlighted}
            onToggleOpen={onToggleOpen}
            disableSelection={disableSelection}
            singleSelection={singleSelection}
            hasSelectedDescendants={hasSelectedDescendants}
        >
            {labelContent}
        </Label>
    )

    /**
     * No children means no arrow, therefore we have to provide something.
     * While "loading" is true, "hasChildren" is false
     * There are some possible children variants as content of this node:
     *
     * 1. Nothing; There are no children
     * 2. Placeholder: There are children, but the Node is closed (show arrow)
     * 3. Error: There are children and loading information somehow failed
     * 4. Child nodes: There are children and the node is open
     */
    const showPlaceholder = hasChildren && !open
    const showChildNodes = hasChildren && open

    useEffect(() => {
        if (open && hasChildren && !nodes) {
            fetch()
        }
    }, [hasChildren, open, nodes, fetch])

    return (
        <Node
            dataTest={`${dataTest}-node`}
            open={open}
            onOpen={onToggleOpen}
            onClose={onToggleOpen}
            component={label}
            icon={loading && <LoadingSpinner />}
        >
            {error && (
                <ErrorMessage dataTest={dataTest}>
                    {i18n.t('Could not load children')}
                </ErrorMessage>
            )}
            {showPlaceholder && <span data-test={`${dataTest}-placeholder`} />}
            {showChildNodes && (
                <OrganisationUnitNodeChildren
                    // Prevent cirular imports
                    OrganisationUnitNode={OrganisationUnitNode}
                    node={node}
                    show={show}
                    autoExpandLoadingError={autoExpandLoadingError}
                    dataTest={dataTest}
                    disableSelection={disableSelection}
                    expanded={expanded}
                    filter={filter}
                    highlighted={highlighted}
                    isUserDataViewFallback={isUserDataViewFallback}
                    onChange={onChange}
                    onChildrenLoaded={onChildrenLoaded}
                    onCollapse={onCollapse}
                    onExpand={onExpand}
                    parentPath={path}
                    renderNodeLabel={renderNodeLabel}
                    rootId={rootId}
                    selected={selected}
                    singleSelection={singleSelection}
                    suppressAlphabeticalSorting={suppressAlphabeticalSorting}
                    nodes={nodes}
                    childCount={childCount}
                    offlineLevels={offlineLevels}
                    prefetchedOrganisationUnits={prefetchedOrganisationUnits}
                />
            )}
        </Node>
    )
}

OrganisationUnitNode.propTypes = {
    dataTest: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    renderNodeLabel: PropTypes.func.isRequired,
    rootId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,

    autoExpandLoadingError: PropTypes.bool,
    childCount: PropTypes.number,
    disableSelection: PropTypes.bool,
    displayName: PropTypes.string,
    expanded: PropTypes.arrayOf(orgUnitPathPropType),
    filter: PropTypes.arrayOf(orgUnitPathPropType),
    highlighted: PropTypes.arrayOf(orgUnitPathPropType),
    isUserDataViewFallback: PropTypes.bool,
    level: PropTypes.number,
    offlineLevels: PropTypes.arrayOf(PropTypes.number),
    path: orgUnitPathPropType,
    prefetchedOrganisationUnits: PropTypes.arrayOf(orgUnitPropType),
    selected: PropTypes.arrayOf(orgUnitPathPropType),
    singleSelection: PropTypes.bool,
    suppressAlphabeticalSorting: PropTypes.bool,
    onChildrenLoaded: PropTypes.func,
    onCollapse: PropTypes.func,
    onExpand: PropTypes.func,
}
