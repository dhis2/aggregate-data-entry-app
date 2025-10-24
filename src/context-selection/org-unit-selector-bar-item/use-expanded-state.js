import { useEffect, useState } from 'react'
import { useOrgUnit } from '../../shared/index.js'
import useUserOrgUnits from './use-user-org-units.js'

const getExpandedOrgUnitsFromPath = (path, userOrgUnits) => {
    if (!path) {
        return []
    }
    // trim path down to the user's available root org units
    const trimmedPath = !userOrgUnits
        ? path
        : userOrgUnits.reduce((trimmedPath, orgUnit) => {
              if (!path.includes(orgUnit)) {
                  return trimmedPath
              }
              const thisPath = path.substring(path.indexOf(orgUnit) - 1)
              return thisPath.length > trimmedPath ? thisPath : trimmedPath
          }, '')

    const selectedPaths = trimmedPath.split('/')
    const expandedPaths = selectedPaths.reduce((acc, cv, index) => {
        const ouPath = `${selectedPaths.slice(0, index).join('/')}/${cv}`
        acc.push(ouPath)
        return acc
    }, [])
    // remove the first item which will be '/' and the last item, for which we do not want to display children)
    return expandedPaths.slice(1, -1)
}

export default function useExpandedState() {
    const [expanded, setExpanded] = useState([])

    const selectedOrgUnit = useOrgUnit()
    const { data: userOrgUnits } = useUserOrgUnits() ?? {}
    const selectedOrgUnitPath = selectedOrgUnit?.data?.path

    // popuate the selected org unit into expanded paths
    useEffect(() => {
        const expandedPaths = getExpandedOrgUnitsFromPath(
            selectedOrgUnitPath,
            userOrgUnits
        )
        setExpanded((prev) => [...new Set([...prev, ...expandedPaths])])
    }, [selectedOrgUnitPath, userOrgUnits])

    const handleExpand = ({ path }) => setExpanded([...expanded, path])
    const handleCollapse = ({ path }) =>
        setExpanded(expanded.filter((p) => p !== path))

    return { expanded, handleExpand, handleCollapse }
}
