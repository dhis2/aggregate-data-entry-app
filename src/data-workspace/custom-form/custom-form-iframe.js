import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import {
    CSS_FILES,
    SCRIPT_FILES,
    PAGE_SCRIPTS,
    PAGE_STYLES,
} from './iframe-assets.js'

const createScriptTag = (baseUrl, script) =>
    `<script src="${baseUrl + script}" type="text/javascript"></script>`

const createLinkTag = (baseUrl, media, styleSheet) =>
    `<link type="text/css" rel="stylesheet" media="${media}" href="${
        baseUrl + styleSheet
    }" >`

const fixRelativePaths = (baseUrl, html) =>
    html.replace(/(src|href)="..\//g, '$1' + `="${baseUrl}/`)

const wrapHtmlInTemplate = (baseUrl, html) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${CSS_FILES.map(({ media, styleSheet }) =>
                createLinkTag(baseUrl, media, styleSheet)
            ).join('\n')}
            ${SCRIPT_FILES.map((script) =>
                createScriptTag(baseUrl, script)
            ).join('\n')}
            
            ${PAGE_SCRIPTS}

            <style type="text/css">
                ${PAGE_STYLES}
            </style>
        </head>
        <body>
            ${fixRelativePaths(baseUrl, html)}
        </body>
    </html>
`

const HtmlReport = ({ html }) => {
    const { baseUrl } = useConfig()
    const iframeRef = useRef(null)
    const [iframeHasLoaded, setIframeHasLoaded] = useState(false)
    const [height, setHeight] = useState()

    useEffect(() => {
        if (!iframeHasLoaded) {
            return
        }

        const iframeHtml =
            iframeRef.current.contentWindow.document.documentElement
        const iframeBody = iframeRef.current.contentWindow.document.body
        const adjustHeight = () => {
            const iframeHtmlRect = iframeHtml.getBoundingClientRect()
            const iframeBodyRect = iframeBody.getBoundingClientRect()
            const maxInnerHeight = Math.max(
                iframeHtmlRect.height,
                iframeBodyRect.height
            )
            // Add 20px as a "safety margin" in case we get a horizontal scroll bar
            setHeight(Math.ceil(maxInnerHeight) + 20)
        }

        const heightObserver = new window.ResizeObserver(adjustHeight)
        heightObserver.observe(iframeHtml)
        heightObserver.observe(iframeBody)

        adjustHeight()

        return heightObserver.disconnect
    }, [iframeHasLoaded])

    return (
        <iframe
            ref={iframeRef}
            id="html-report-id"
            srcDoc={wrapHtmlInTemplate(baseUrl, html)}
            title="html-report-content"
            width="100%"
            height={height}
            seamless={true}
            sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
            onLoad={() => setIframeHasLoaded(true)}
        >
            <style jsx>{`
                iframe {
                    border: none;
                    flex-grow: 1;
                }
            `}</style>
        </iframe>
    )
}

HtmlReport.propTypes = {
    html: PropTypes.string.isRequired,
}

export default HtmlReport
