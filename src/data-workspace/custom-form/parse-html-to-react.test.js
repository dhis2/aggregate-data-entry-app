import React from 'react'
import { CustomFormTotalCell } from './custom-form-total-cell.js'
import { parseHtmlToReact } from './parse-html-to-react.js'

describe('parseHtmlToReact', () => {
    it('replaces total cells inside td elements', () => {
        const htmlCode =
            "<td><input id='totalRANDOMuid01' name='total' dataelementid='RANDOMuid01'/></td>"
        const metadata = {}
        const result = parseHtmlToReact(htmlCode, metadata)
        expect(result).toEqual(
            <CustomFormTotalCell dataElementId="RANDOMuid01" />
        )
    })
    it('replaces total cells outside of elements', () => {
        const htmlCode =
            "<div><input id='totalRANDOMuid01' name='total' dataelementid='RANDOMuid01'/></div>"
        const metadata = {}
        const result = parseHtmlToReact(htmlCode, metadata)
        expect(result).toEqual(
            <div>
                <CustomFormTotalCell dataElementId="RANDOMuid01" />
            </div>
        )
    })
})
