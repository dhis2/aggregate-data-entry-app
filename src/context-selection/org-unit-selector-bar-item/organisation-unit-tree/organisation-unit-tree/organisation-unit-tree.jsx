import { requiredIf } from '@dhis2/prop-types'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo } from 'react'
import { OrganisationUnitNode } from '../organisation-unit-node/index.js'
import { orgUnitPathPropType } from '../prop-types.js'
import { defaultRenderNodeLabel } from './default-render-node-label/index.js'
import { filterRootIds } from './filter-root-ids.js'
import { RootError } from './root-error.jsx'
import { RootLoading } from './root-loading.jsx'
import { useExpanded } from './use-expanded/index.js'
import { useForceReload } from './use-force-reload.js'
import { useRootOrgData } from './use-root-org-data/index.js'

// Used to provide a stable reference for prop defaults
const emptyArray = []

const OrganisationUnitTree = ({
    onChange,
    roots,

    autoExpandLoadingError,
    dataTest = 'dhis2-uiwidgets-orgunittree',
    filter = emptyArray,
    highlighted = emptyArray,
    initiallyExpanded = emptyArray,
    selected = emptyArray,
    renderNodeLabel = defaultRenderNodeLabel,

    disableSelection,
    forceReload,
    isUserDataViewFallback,
    singleSelection,
    suppressAlphabeticalSorting,
    offlineLevels,
    prefetchedOrganisationUnits,

    expanded: expandedControlled,
    handleExpand: handleExpandControlled,
    handleCollapse: handleCollapseControlled,

    onExpand,
    onCollapse,
    onChildrenLoaded,
}) => {
    const rootIds = useMemo(
        () => filterRootIds(filter, Array.isArray(roots) ? roots : [roots]),
        [roots, filter]
    )
    const reloadId = useForceReload(forceReload)
    const [prevReloadId, setPrevReloadId] = useState(reloadId)
    const { called, loading, error, rootNodes, refetch } = useRootOrgData(
        rootIds,
        {
            isUserDataViewFallback,
            suppressAlphabeticalSorting,
            prefetchedOrganisationUnits,
        }
    )

    const { expanded, handleExpand, handleCollapse } = useExpanded({
        initiallyExpanded,
        onExpand,
        onCollapse,
        expandedControlled,
        handleExpandControlled,
        handleCollapseControlled,
    })

    useEffect(() => {
        // do not refetch on initial render
        if (refetch && reloadId > 0 && reloadId !== prevReloadId) {
            refetch()
            setPrevReloadId(reloadId)
        }

        return () =>
            console.warn(
                '@TODO: Why does this component unmount after a force reload?'
            )
    }, [reloadId, prevReloadId, refetch])

    const isLoading = !called || loading

    return (
        <div data-test={dataTest}>
            {isLoading && <RootLoading />}
            {error && <RootError error={error} />}
            {!error &&
                !isLoading &&
                rootNodes.map((rootNode) => (
                    <OrganisationUnitNode
                        key={rootNode.path}
                        rootId={rootNode.id}
                        autoExpandLoadingError={autoExpandLoadingError}
                        dataTest={dataTest}
                        disableSelection={disableSelection}
                        displayName={rootNode.displayName}
                        expanded={expanded}
                        highlighted={highlighted}
                        id={rootNode.id}
                        isUserDataViewFallback={isUserDataViewFallback}
                        filter={filter}
                        path={rootNode.path}
                        childCount={rootNode.children}
                        renderNodeLabel={renderNodeLabel}
                        selected={selected}
                        singleSelection={singleSelection}
                        suppressAlphabeticalSorting={
                            suppressAlphabeticalSorting
                        }
                        onChange={onChange}
                        onChildrenLoaded={onChildrenLoaded}
                        onCollapse={handleCollapse}
                        onExpand={handleExpand}
                        level={rootNode.level}
                        offlineLevels={offlineLevels[rootNode.path]}
                        prefetchedOrganisationUnits={
                            prefetchedOrganisationUnits
                        }
                    />
                ))}
        </div>
    )
}

OrganisationUnitTree.propTypes = {
    /** Root org unit ID(s) */
    roots: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,

    /** Will be called with the following object:
     * `{ id: string, displayName: string, path: string, checked: boolean, selected: string[] }` */
    onChange: PropTypes.func.isRequired,

    /** When set, the error when loading children fails will be shown automatically */
    autoExpandLoadingError: PropTypes.bool,

    dataTest: PropTypes.string,

    /** When set to true, no unit can be selected */
    disableSelection: PropTypes.bool,

    expanded: requiredIf(
        (props) => !!props.handleExpand || !!props.handleCollapse,
        PropTypes.arrayOf(PropTypes.string)
    ),

    /**
     * All organisation units with a path that includes the provided paths will be shown.
     * All others will not be rendered. When not provided, all org units will be shown.
     */
    filter: PropTypes.arrayOf(orgUnitPathPropType),

    /** When true, everything will be reloaded. In order to load it again after reloading, `forceReload` has to be set to `false` and then to `true` again */
    forceReload: PropTypes.bool,

    handleCollapse: requiredIf(
        (props) => !!props.expanded || !!props.handleExpand,
        PropTypes.func
    ),

    handleExpand: requiredIf(
        (props) => !!props.expanded || !!props.handleCollapse,
        PropTypes.func
    ),

    /**
     * All units provided to "highlighted" as path will be visually
     * highlighted.
     * Note:
     * The d2-ui component used two props for this:
     * * searchResults
     * * highlightSearchResults
     */
    highlighted: PropTypes.arrayOf(orgUnitPathPropType),

    /**
     * An array of OU paths that will be expanded automatically
     * as soon as they are encountered.
     * The path of an OU is the UIDs of the OU
     * and all its parent OUs separated by slashes (/)
     * Note: This replaces "openFirstLevel" as that's redundant
     */
    initiallyExpanded: PropTypes.arrayOf(orgUnitPathPropType),

    /** When provided, the 'isUserDataViewFallback' option will be sent when requesting the org units */
    isUserDataViewFallback: PropTypes.bool,

    /**
     * Used by the component to determine if children can be found in the prefetchedOrgUnits
     * or if they need to be fetched from the server
     */
    offlineLevels: requiredIf(
        (props) => !!props.prefetchedOrganisationUnits,
        PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number))
    ),

    /** When provided the org unit tree will get node children from there if possible */
    prefetchedOrganisationUnits: requiredIf(
        (props) => !!props.offlineLevels,
        PropTypes.arrayOf(
            PropTypes.shape({
                displayName: PropTypes.string,
                id: PropTypes.string,
                path: PropTypes.string,
            })
        )
    ),

    /** Renders the actual node component for each leaf, can be used to
     * customize the node. The default function just returns the node's
     * displayName
     *
     * Shape of the object passed to the callback:
     * ```
     * {
     *    label: string,
     *    node: {
     *      displayName: string,
     *      id: string,
     *      // Only provided once `loading` is false
     *      path?: string,
     *      // Only provided once `loading` is false
     *      children?: Array.<{
     *        id: string,
     *        path: string,
     *        displayName: string
     *      }>
     *    },
     *    loading: boolean,
     *    error: string,
     *    open: boolean,
     *    selected: string[],
     *    singleSelection: boolean,
     *    disableSelection: boolean,
     * }
     * ``` */
    renderNodeLabel: PropTypes.func,

    /** An array of paths of selected OUs. The path of an OU is the UIDs of the OU and all its parent OUs separated by slashes (`/`) */
    selected: PropTypes.arrayOf(orgUnitPathPropType),

    /** When set, no checkboxes will be displayed and only the first selected path in `selected` will be highlighted */
    singleSelection: PropTypes.bool,

    /** Turns off alphabetical sorting of units */
    suppressAlphabeticalSorting: PropTypes.bool,

    /** Called with the children's data that was loaded */
    onChildrenLoaded: PropTypes.func,

    /** Called with `{ path: string }` with the path of the parent of the level closed */
    onCollapse: PropTypes.func,

    /** Called with `{ path: string }` with the path of the parent of the level opened */
    onExpand: PropTypes.func,

    /**
     * All units with ids (not paths!) provided
     * to "idsThatShouldBeReloaded" will be reloaded
     * In order to reload an id twice, the array must be changed
     * while keeping the id to reload in the array
     *
     * NOTE: This is currently not working due to a limitation
     * of the data engine (we can't force specific resource to reload,
     * we'd have to reload the sibling nodes currently as well)
     */
    //idsThatShouldBeReloaded: propTypes.arrayOf(orgUnitIdPropType),
}

export { OrganisationUnitTree }
