# Context selection

This module exports three variables:

-   `contextSelectionConstants` & `useContextSelection`
    -   These need to be used in conjunction to retrieve the context selection
        global state
-   `ContextSelection`
    -   This is the component that should be rendered in the appropriate layout
        area

## Global state

The global state of the context selection is defined in
`use-context-selection.js`. In order to use some of the context selection
values, you can use the constants defined in
`src/context-selection/constants.js` (exported as `contextSelectionConstants`).

If you need just a value, like the dataSetId, you can retrieve it the following
way:

```js
import {
    contextSelectionConstants,
    useContextSelection,
} from '../context-selection'

export default function Comp() {
    const [query] = useContextSelection()
    const dataSetId = query[contextSelectionConstants.PARAM_DATA_SET_ID]

    return <div />
}
```

## Co-locating logic with selectors

The individual selectors are supposed to be completely self-contained in terms
of logic. A good example is that when changing the data set to one with a
different period type, the selected period type selection should be deselected.
The data set selector should not have to know about that. Instead the period
selector subscribes to changes of the data set id and deselects the currently
selected period when the period type of the data set changes.

## ContextSelection component

This component works in isolation as it uses `use-query-params` and doesn't
require any props.
