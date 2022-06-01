import parse from 'html-react-parser'
import { replaceInputNode } from './replace-input-node.js'
import { replaceTdNode } from './replace-td-node.js'

export const parseHtmlToReact = (htmlCode, metadata) => {
    return parse(htmlCode, {
        replace: (domNode) => {
            switch (domNode.name) {
                case 'input':
                    return replaceInputNode(domNode, metadata)
                case 'td':
                    return replaceTdNode(domNode)
                default:
                    return undefined
            }
        },
    })
}
