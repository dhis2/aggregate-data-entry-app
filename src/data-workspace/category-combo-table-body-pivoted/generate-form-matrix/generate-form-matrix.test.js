import { pivotTestData as options } from './__fixtures/pivot-test-data.js'
import { generateFormMatrix } from './generate-form-matrix.js'

describe('generate-form-matrix', () => {
    describe('pivoted mode', () => {
        it('should show all categories and data elements in the column headers', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'pivot',
            })
            expect(
                rowsMatrix[0].map((col) => col.displayFormName)
            ).toIncludeAllMembers([
                // categories
                'Location Fixed/Outreach',
                'EPI/nutrition age',
                // first and last data elements
                'Children getting therapeutic feeding',
                'Children supplied with food supplemements',
                'Weight for height below 70 percent',
            ])
        })

        it('should show all category options in the row headers', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'pivot',
            })

            const allRowHeaders = rowsMatrix
                .flat()
                .flat()
                .filter((field) => field.type === 'rowHeader')

            expect(
                allRowHeaders.map((col) => col.displayFormName)
            ).toIncludeAllMembers([
                'Fixed',
                '<1y',
                '>1y',
                'Outreach',
                '<1y',
                '>1y',
            ])
        })

        it('should have data elements equal to the combination of all data elements and cocs', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'pivot',
            })

            const allDataElementsFields = rowsMatrix
                .flat()
                .flat()
                .filter((field) => field.type === 'de')

            expect(allDataElementsFields.length).toEqual(
                options.dataElements.length * options.sortedCOCs.length
            )
        })

        // sanity snapshot check for the refactors
        it('should create a full pivoted matrix', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'pivot',
            })
            // expect(rowsMatrix).toIncludeSameMembers(expectedResult)
            expect(rowsMatrix).toMatchSnapshot()
        })
    })

    describe('grouping by data element and moving a category to row', () => {
        it('should show categories and category options in columns', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'move_categories',
                pivotedCategory: 'fMZEcRHuamy',
            })

            const allColumnHeaders = rowsMatrix
                .flat()
                .flat()
                .filter((field) => field.type === 'columnHeader')
            expect(
                allColumnHeaders
                    .filter((col) => col.metadataType === 'category')
                    .map((cat) => cat.displayFormName)
            ).toEqual(['EPI/nutrition age', 'Location Fixed/Outreach'])
            expect(
                allColumnHeaders
                    .filter((col) => col.metadataType === 'categoryOption')
                    .map((cat) => cat.displayFormName)
            ).toEqual(['<1y', '>1y'])
        })
        it('should show the transposed category category options in the row', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'move_categories',
                pivotedCategory: 'fMZEcRHuamy',
            })

            const allColumnHeaders = rowsMatrix
                .flat()
                .flat()
                .filter((field) => field.type === 'rowHeader')
            expect(
                allColumnHeaders
                    .filter((col) => col.metadataType === 'dataElement')
                    .map((cat) => cat.displayFormName)
            ).toIncludeAllMembers([
                // first and last data elements
                'Children getting therapeutic feeding',
                'Children supplied with food supplemements',
                'Weight for height below 70 percent',
            ])
            expect(
                allColumnHeaders
                    .filter((col) => col.metadataType === 'dataElement')
                    .map((cat) => cat.displayFormName)
            ).toIncludeAllMembers([
                // first and last data elements
                'Children getting therapeutic feeding',
                'Children supplied with food supplemements',
                'Weight for height below 70 percent',
            ])

            // category option will be repeated for as many data element as there are
            expect([
                ...new Set([
                    ...allColumnHeaders
                        .filter((col) => col.metadataType === 'categoryOption')
                        .map((cat) => cat.displayFormName),
                ]),
            ]).toEqual(['Fixed', 'Outreach'])
        })

        it('should group the matrix based on data elements and category', () => {
            const rowsMatrix = generateFormMatrix(options, {
                pivotMode: 'move_categories',
                pivotedCategory: 'fMZEcRHuamy',
            })
            expect(rowsMatrix).toMatchSnapshot()
        })
    })
})
