import React from 'react'
import { Form } from 'react-final-form'
import { render } from '../../test-utils/index.js'
import { parseHtmlToReact } from './parse-html-to-react.js'

const dataElements = {
    deId: {
        id: 'deId',
        displayName: 'Data element!',
    }
}

const metadata = { dataElements }

describe('parseHtmlToReact', () => {
    it('should replace all vanilla inputs with a <DataEntryField/>', () => {
        const html = `
            <div>
                <input id="deId-cocId-val" type="input" name="I am Input" />
            </div>
        `
        const parsed = parseHtmlToReact(html, metadata)
        const result = render(parsed, {
            wrapper: (children) => (
                <Form
                    onSubmit={() => null}
                    component={() => <div>{children}</div>}
                />
            )
        })

        console.log('> result', result.current)
    })
})
