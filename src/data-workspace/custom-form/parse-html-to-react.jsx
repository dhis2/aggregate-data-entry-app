import parse from 'html-react-parser'
import React from 'react'
import { replaceInputNode } from './replace-input-node.jsx'
import { replaceTdNode } from './replace-td-node.jsx'

export const parseHtmlToReact = (htmlCode, metadata) =>
    parse(htmlCode, {
        replace: (domNode) => {
            switch (domNode.name) {
                case 'input':
                    return replaceInputNode(domNode, metadata)
                case 'td':
                    return replaceTdNode(domNode, metadata)
                case 'script':
                    // remove script tags
                    return <></>
                default:
                    return undefined
            }
        },
    })
