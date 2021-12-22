import { useState } from 'react'

export default function useExpandedState() {
    const [expanded, setExpanded] = useState([])
    const handleExpand = ({ path }) => setExpanded([...expanded, path])
    const handleCollapse = ({ path }) =>
        setExpanded(expanded.filter((p) => p !== path))

    return { expanded, handleExpand, handleCollapse }
}
