import React from 'react'
import { DataEntryField } from '../data-entry-cell/index.js'
import { CustomFormTotalCell } from './custom-form-total-cell.jsx'
import { parseHtmlToReact } from './parse-html-to-react.jsx'

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

    it('uses disabled entry field when input has disabled attribute', () => {
        const htmlCode =
            "<div><input id='RANDOMuid01-randomCOC02-val' name='entryfield' title='A DE' val='[ A DE ]' disabled='disabled'/></div>"

        const metadata = {
            dataElements: { RANDOMuid01: { id: 'RANDOMuid01' } },
        }
        const result = parseHtmlToReact(htmlCode, metadata)
        expect(result).toEqual(
            <div>
                <DataEntryField
                    disabled={true}
                    dataElement={{ id: 'RANDOMuid01' }}
                    categoryOptionCombo={{ id: 'randomCOC02' }}
                />
            </div>
        )
    })

    it('uses non disabled entry field when input does not have disabled attribute ', () => {
        const htmlCode =
            "<div><input id='RANDOMuid01-randomCOC02-val' name='entryfield' title='A DE' val='[ A DE ]'/></div>"

        const metadata = {
            dataElements: { RANDOMuid01: { id: 'RANDOMuid01' } },
        }
        const result = parseHtmlToReact(htmlCode, metadata)
        expect(result).toEqual(
            <div>
                <DataEntryField
                    disabled={false}
                    dataElement={{ id: 'RANDOMuid01' }}
                    categoryOptionCombo={{ id: 'randomCOC02' }}
                />
            </div>
        )
    })
})
