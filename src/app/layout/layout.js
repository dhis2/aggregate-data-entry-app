import classnames from 'classnames'
import { node, bool } from 'prop-types'
import React from 'react'
import css from './layout.module.css'

const Layout = ({ header, main, sidebar, showSidebar, showFooter }) => {
    const wrapperClass = classnames(css.wrapper, {
        [css.showSidebar]: showSidebar,
        [css.showFooter]: showFooter,
    })

    return (
        <div className={wrapperClass}>
            <header className={css.header}>{header}</header>

            <div
                // Using a div here because the data workspace component
                // renders both a `main` and a `footer` element
                className={css.main}
            >
                {main}
            </div>

            <aside className={css.sidebar}>{sidebar}</aside>
        </div>
    )
}

Layout.propTypes = {
    header: node,
    main: node,
    showFooter: bool,
    showSidebar: bool,
    sidebar: node,
}

export default Layout
