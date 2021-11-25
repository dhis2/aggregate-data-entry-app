import classnames from 'classnames'
import { node, bool } from 'prop-types'
import React from 'react'
import css from './layout.module.css'

const Layout = ({ header, main, sidebar, footer, showSidebar, showFooter }) => {
    const wrapperClass = classnames(css.wrapper, {
        [css.showSidebar]: showSidebar,
        [css.showFooter]: showFooter,
    })

    return (
        <div className={wrapperClass}>
            <header className={css.header}>{header}</header>
            <main className={css.main}>{main}</main>
            <aside className={css.sidebar}>{sidebar}</aside>
            {showFooter && <footer className={css.footer}>{footer}</footer>}
        </div>
    )
}

Layout.propTypes = {
    footer: node,
    header: node,
    main: node,
    showFooter: bool,
    showSidebar: bool,
    sidebar: node,
}

export default Layout
