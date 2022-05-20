# Right Hand Panel

The right hand panel is a UI that's being displayed in a sidebar to the right
of the actual main area.

## Table of Contents

-   [The right hand panel](#the-righthandpanel)
-   [Creating a sidebar](#creating-a-sidebar)
-   [Rendering a sidebar](#rendering-a-sidebar)

<a name="the-righthandpanel"></a>

## The right hand panel

The right hand panel is rendered by the `<App />` component in `src/app/app.js`.
Whether the `<Layout />` component should display the right hand panel is
determined by whether an id is in the right hand panel context (see [Rendering
a sidebar](#rendering-a-sidebar) for example how to set the id) or not.

The `<RightHandPanel />` component itself just renders an anchor. The anchor is
a component that does not accept any props and uses `React.memo` and therefore
won't rerender at all, which makes the very same anchor DOM element be present
in the DOM for good (as the app only hides the "sidebar" part, it still renders
the jsx passed to it).

The `<RightHandPanelPortal />` will render its children into that DOM element,
but only if the current id in the right hand panel context is the same as the
one passed to the `<RightHandPanelPortal id="..." />`, otherwise it'll return
`null`. Internally the component uses `React.createPortal`.

### Why this way?

The advantage is that the sidebars can now be co-located with the code that
wants to render a sidebar. For example the "Help" item in the contextual help
menu (which can be opened by clicking on the "Options" dropdown button on the
right side of the context selector) just needs to render the sidebar just right
next to the dropdown menu item (see [options-button.js](../../src/context-selection/context-selection/options-button.js))

<a name="creating-a-sidebar"></a>

## Creating a sidebar

The `src/sidebar` folder exports the necessary UI components to build a
sidebar. The sidebar itself has to be placed in the right hand panel, but this
section is about creating the UI first.

```js
import { Sidebar, Title, ToggleableUnit } from '../sidebar/index.js'

export default function YourSidebar({ onClose }) {
    return (
        <Sidebar>
            <Title onClose={onClose}></Title>

            <ToggleableUnit title={i18n.t('Section 1')}>
                Sidebar content
            </ToggleableUnit>

            <ToggleableUnit title={i18n.t('Section 2')}>
                Other sidebar content
            </ToggleableUnit>
        </Sidebar>
    )
}
```

<a name="rendering-a-sidebar"></a>

## Rendering a sidebar

Now that there is a sidebar component, it needs to be rendered. It will be
rendered in the right hand panel section. In order to get it there, the
`RightHandPanelPortal` component can be used:

```js
<RightHandPanelPortal id="id-for-this-particular-sidebar">
    <DataDetailsSidebar />
</RightHandPanelPortal>
```

The `id` prop will be used by the `RightHandPanelPortal` to determine whether
the sidebar should be rendered or not. There can be only one id at a time, so
multiple sidebars could be rendered without overlapping each other.

The id and setters can be accessed using the `useRightHandPanelContext`
hook:

```js
const { id, show, hide } = useRightHandPanelContext()

// Opens the sidebar when the component renders for the first time
// and hides it when this component unmounts
useEffect(() => {
    show('id-for-this-particular-sidebar')
    return () => hide()
}, [])
```
