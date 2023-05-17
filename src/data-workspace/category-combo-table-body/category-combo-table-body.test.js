import { Table } from '@dhis2/ui'
import { getAllByTestId, getByTestId, getByText } from '@testing-library/react'
import React from 'react'
import { useMetadata } from '../../shared/metadata/use-metadata.js'
import { render } from '../../test-utils/index.js'
import { FinalFormWrapper } from '../final-form-wrapper.js'
import { CategoryComboTableBody } from './category-combo-table-body.js'

jest.mock('../../shared/metadata/use-metadata.js', () => ({
    useMetadata: jest.fn(),
}))

const categories = {
    fMZEcRHuamy: {
        allItems: false,
        categoryOptions: ['qkPbeWaFsnU', 'wbrDrL2aYEc'],
        code: 'LOC_FIX_OUTREACH',
        created: '2011-12-24T12:24:25.155',
        dataDimension: true,
        dataDimensionType: 'DISAGGREGATION',
        dimension: 'fMZEcRHuamy',
        dimensionType: 'CATEGORY',
        displayFormName: 'Location Fixed/Outreach',
        displayName: 'Location Fixed/Outreach',
        displayShortName: 'Location Fixed/Outreach',
        favorite: false,
        id: 'fMZEcRHuamy',
        lastUpdated: '2013-05-28T09:59:32.881',
        name: 'Location Fixed/Outreach',
        shortName: 'Location Fixed/Outreach',
    },
    YNZyaJHiHYq: {
        allItems: false,
        categoryOptions: ['btOyqprQ9e8', 'GEqzEKCHoGA'],
        code: 'EPI_NUTR_AGE',
        created: '2011-12-24T12:24:25.155',
        dataDimension: true,
        dataDimensionType: 'DISAGGREGATION',
        dimension: 'YNZyaJHiHYq',
        dimensionType: 'CATEGORY',
        displayFormName: 'EPI/nutrition age',
        displayName: 'EPI/nutrition age',
        displayShortName: 'EPI/nutrition age',
        favorite: false,
        id: 'YNZyaJHiHYq',
        lastUpdated: '2013-05-28T09:32:43.922',
        name: 'EPI/nutrition age',
        shortName: 'EPI/nutrition age',
    },
    GLevLNI9wkl: {
        allItems: false,
        categoryOptions: ['xYerKDKCefk'],
        code: 'default',
        created: '2012-11-21T12:15:18.537',
        dataDimension: false,
        dataDimensionType: 'DISAGGREGATION',
        dimension: 'GLevLNI9wkl',
        dimensionType: 'CATEGORY',
        displayFormName: 'default',
        displayName: 'default',
        displayShortName: 'default',
        favorite: false,
        id: 'GLevLNI9wkl',
        lastUpdated: '2023-05-15T23:04:45.545',
        name: 'default',
    },
}

const categoryOptions = {
    xYerKDKCefk: {
        code: 'default',
        created: '2011-12-24T12:24:24.149',
        dimensionItem: 'xYerKDKCefk',
        dimensionItemType: 'CATEGORY_OPTION',
        displayFormName: 'default',
        displayName: 'default',
        displayShortName: 'default',
        favorite: false,
        id: 'xYerKDKCefk',
        isDefault: true,
        lastUpdated: '2016-04-12T20:37:48.414',
        name: 'default',
        organisationUnits: [],
    },
    qkPbeWaFsnU: {
        code: 'FIXED',
        created: '2011-12-24T12:24:24.149',
        dimensionItem: 'qkPbeWaFsnU',
        dimensionItemType: 'CATEGORY_OPTION',
        displayFormName: 'Fixed',
        displayName: 'Fixed',
        displayShortName: 'Fixed',
        favorite: false,
        id: 'qkPbeWaFsnU',
        isDefault: false,
        lastUpdated: '2011-12-24T12:24:24.149',
        name: 'Fixed',
        organisationUnits: [],
        shortName: 'Fixed',
    },
    wbrDrL2aYEc: {
        code: 'OUTREACH\nOUTREACH',
        created: '2011-12-24T12:24:24.149',
        dimensionItem: 'wbrDrL2aYEc',
        dimensionItemType: 'CATEGORY_OPTION',
        displayFormName: 'Outreach',
        displayName: 'Outreach',
        displayShortName: 'Outreach',
        favorite: false,
        id: 'wbrDrL2aYEc',
        isDefault: false,
        lastUpdated: '2011-12-24T12:24:24.149',
        name: 'Outreach',
        organisationUnits: [],
        shortName: 'Outreach',
    },
    btOyqprQ9e8: {
        code: '<1y',
        created: '2011-12-24T12:24:24.149',
        dimensionItem: 'btOyqprQ9e8',
        dimensionItemType: 'CATEGORY_OPTION',
        displayFormName: '<1y',
        displayName: '<1y',
        displayShortName: '<1y',
        favorite: false,
        id: 'btOyqprQ9e8',
        isDefault: false,
        lastUpdated: '2015-03-11T11:56:54.123',
        name: '<1y',
        organisationUnits: [],
        shortName: '<1y',
    },
    GEqzEKCHoGA: {
        code: '>1y',
        created: '2011-12-24T12:24:24.149',
        dimensionItem: 'GEqzEKCHoGA',
        dimensionItemType: 'CATEGORY_OPTION',
        displayFormName: '>1y',
        displayName: '>1y',
        displayShortName: '>1y',
        favorite: false,
        id: 'GEqzEKCHoGA',
        isDefault: false,
        lastUpdated: '2014-03-05T04:57:24.116',
        name: '>1y',
        organisationUnits: [],
        shortName: '>1y',
    },
}

const dataElements = {
    s46m5MS0hxu: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359706',
        created: '2010-02-05T10:58:19.053',
        description: 'BCG doses administered.',
        displayFormName: 'BCG doses given',
        displayName: 'BCG doses given',
        displayShortName: 'BCG doses given',
        id: 's46m5MS0hxu',
        lastUpdated: '2015-04-02T19:51:21.183',
        name: 'BCG doses given',
        valueType: 'INTEGER',
        zeroIsSignificant: false,
    },
    UOlfIjgN8X6: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_36',
        created: '2012-11-05T12:48:48.279',
        displayFormName: 'Fully Immunized child',
        displayName: 'Fully Immunized child',
        displayShortName: 'Fully Immunized Child',
        id: 'UOlfIjgN8X6',
        lastUpdated: '2015-02-24T16:03:07.926',
        name: 'Fully Immunized child',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    z7duEFcpApd: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359709',
        created: '2010-02-05T10:57:58.041',
        displayFormName: 'LLITN given at Penta3',
        displayName: 'LLITN given at Penta3',
        displayShortName: 'LLITN at Penta3',
        id: 'z7duEFcpApd',
        lastUpdated: '2014-11-11T21:56:05.884',
        name: 'LLITN given at Penta3',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    x3Do5e7g4Qo: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359707',
        created: '2010-02-05T10:57:23.270',
        description: '0-13 days after birth.',
        displayFormName: 'OPV0 doses given',
        displayName: 'OPV0 doses given',
        displayShortName: 'OPV0 doses given ',
        id: 'x3Do5e7g4Qo',
        lastUpdated: '2014-11-11T21:56:05.530',
        name: 'OPV0 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    pikOziyCXbM: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_19',
        created: '2012-11-05T12:55:05.154',
        displayFormName: 'OPV1 doses given',
        displayName: 'OPV1 doses given',
        displayShortName: 'OPV1 doses given',
        id: 'pikOziyCXbM',
        lastUpdated: '2014-11-11T21:56:05.529',
        name: 'OPV1 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    O05mAByOgAv: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_20',
        created: '2012-11-05T12:47:11.853',
        displayFormName: 'OPV2 doses given',
        displayName: 'OPV2 doses given',
        displayShortName: 'OPV2 doses given',
        id: 'O05mAByOgAv',
        lastUpdated: '2014-11-11T21:56:05.833',
        name: 'OPV2 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    vI2csg55S9C: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_21',
        created: '2012-11-05T12:47:33.202',
        displayFormName: 'OPV3 doses given',
        displayName: 'OPV3 doses given',
        displayShortName: 'OPV3 doses given',
        id: 'vI2csg55S9C',
        lastUpdated: '2014-11-11T21:56:05.531',
        name: 'OPV3 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    xc8gmAKfO95: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359722',
        created: '2010-02-05T10:57:21.613',
        description: 'Pneumococcal Vaccine',
        displayFormName: 'PCV1 doses given',
        displayName: 'PCV1 doses given',
        displayShortName: 'PCV1 doses given',
        id: 'xc8gmAKfO95',
        lastUpdated: '2014-11-11T21:56:05.913',
        name: 'PCV1 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    mGN1az8Xub6: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359723',
        created: '2010-02-05T10:57:21.488',
        description: 'Penumococcal Vaccine',
        displayFormName: 'PCV2 doses given',
        displayName: 'PCV2 doses given',
        displayShortName: 'PCV2 doses given',
        id: 'mGN1az8Xub6',
        lastUpdated: '2014-11-11T21:56:05.920',
        name: 'PCV2 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    L2kxa2IA2cs: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_359724',
        created: '2010-02-05T10:57:21.363',
        description: 'Penumococcal Vaccine',
        displayFormName: 'PCV3 doses given',
        displayName: 'PCV3 doses given',
        displayShortName: 'PCV3 doses given',
        id: 'L2kxa2IA2cs',
        lastUpdated: '2014-11-11T21:56:05.713',
        name: 'PCV3 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    fClA2Erf6IO: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_23',
        created: '2012-11-05T12:47:53.340',
        displayFormName: 'Penta1 doses given',
        displayName: 'Penta1 doses given',
        displayShortName: 'Penta1 doses given',
        id: 'fClA2Erf6IO',
        lastUpdated: '2014-11-11T21:56:05.879',
        name: 'Penta1 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    I78gJm4KBo7: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_24',
        created: '2012-11-05T12:48:08.439',
        displayFormName: 'Penta2 doses given',
        displayName: 'Penta2 doses given',
        displayShortName: 'Penta2 doses given',
        id: 'I78gJm4KBo7',
        lastUpdated: '2014-11-11T21:56:05.822',
        name: 'Penta2 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    n6aMJNLdvep: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_25',
        created: '2012-11-05T12:56:39.621',
        displayFormName: 'Penta3 doses given',
        displayName: 'Penta3 doses given',
        displayShortName: 'Penta3 doses given',
        id: 'n6aMJNLdvep',
        lastUpdated: '2014-11-11T21:56:05.768',
        name: 'Penta3 doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    l6byfWFUGaP: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_35',
        created: '2011-12-24T12:24:25.088',
        displayFormName: 'Yellow Fever doses given',
        displayName: 'Yellow Fever doses given',
        displayShortName: 'Yellow Fever doses given',
        id: 'l6byfWFUGaP',
        lastUpdated: '2015-08-06T13:28:05.512',
        name: 'Yellow Fever doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    YtbsuPPo010: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'dzjKKQq0cSO' },
        code: 'DE_34',
        created: '2012-11-05T12:48:30.861',
        displayFormName: 'Measles doses given',
        displayName: 'Measles doses given',
        displayShortName: 'Measles doses given',
        id: 'YtbsuPPo010',
        lastUpdated: '2014-11-11T21:56:05.875',
        name: 'Measles doses given',
        valueType: 'NUMBER',
        zeroIsSignificant: false,
    },
    FTRrcoaog83: {
        aggregationType: 'SUM',
        categoryCombo: { id: 'bjDvmb4bfuf' },
        code: 'DE_1148614',
        created: '2011-04-20T17:54:58.775',
        displayFormName: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
        displayName: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
        displayShortName: 'Accute Flaccid Paral (Deaths < 5 yrs)',
        id: 'FTRrcoaog83',
        lastUpdated: '2017-05-19T15:13:52.488',
        name: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
        valueType: 'NUMBER',
    },
}

const categoryCombos = {
    dzjKKQq0cSO: {
        id: 'dzjKKQq0cSO',
        categories: ['fMZEcRHuamy', 'YNZyaJHiHYq'],
        categoryOptionCombos: [
            {
                categoryOptions: ['wbrDrL2aYEc', 'btOyqprQ9e8'],
                code: 'COC_290',
                displayName: 'Outreach, <1y',
                id: 'V6L425pT3A0',
                name: 'Outreach, <1y',
            },
            {
                categoryOptions: ['wbrDrL2aYEc', 'GEqzEKCHoGA'],
                code: 'COC_289',
                displayName: 'Outreach, >1y',
                id: 'hEFKSsPV5et',
                name: 'Outreach, >1y',
            },
            {
                categoryOptions: ['qkPbeWaFsnU', 'btOyqprQ9e8'],
                code: 'COC_292',
                displayName: 'Fixed, <1y',
                id: 'Prlt0C1RF0s',
                name: 'Fixed, <1y',
            },
            {
                categoryOptions: ['qkPbeWaFsnU', 'GEqzEKCHoGA'],
                code: 'COC_291',
                displayName: 'Fixed, >1y',
                id: 'psbwp3CQEhs',
                name: 'Fixed, >1y',
            },
        ],
        created: '2011-12-24T12:24:25.203',
        dataDimensionType: 'DISAGGREGATION',
        displayName: 'Location and age group',
        favorite: false,
        isDefault: false,
        lastUpdated: '2011-12-24T12:24:25.203',
        name: 'Location and age group',
    },
    bjDvmb4bfuf: {
        categories: ['GLevLNI9wkl'],
        categoryOptionCombos: [
            {
                code: 'default',
                name: 'default',
                categoryOptions: ['xYerKDKCefk'],
                displayName: 'default',
                id: 'HllvX50cXC0',
            },
        ],
        code: 'default',
        created: '2011-12-24T12:24:25.203',
        dataDimensionType: 'DISAGGREGATION',
        displayName: 'default',
        favorite: false,
        id: 'bjDvmb4bfuf',
        isDefault: true,
        lastUpdated: '2016-04-12T20:37:49.126',
        name: 'default',
    },
}

const metadata = {
    categories,
    categoryOptions,
    categoryCombos,
    dataElements,
}

describe('<CategoryComboTableBody />', () => {
    useMetadata.mockReturnValue({ data: metadata })

    it('should render rows and columns based on the data elements and categorycombo', () => {
        const tableDataElements = [
            dataElements.s46m5MS0hxu,
            dataElements.UOlfIjgN8X6,
            dataElements.z7duEFcpApd,
            dataElements.x3Do5e7g4Qo,
            dataElements.pikOziyCXbM,
            dataElements.O05mAByOgAv,
            dataElements.vI2csg55S9C,
            dataElements.xc8gmAKfO95,
            dataElements.mGN1az8Xub6,
            dataElements.L2kxa2IA2cs,
            dataElements.fClA2Erf6IO,
            dataElements.I78gJm4KBo7,
            dataElements.n6aMJNLdvep,
            dataElements.l6byfWFUGaP,
            dataElements.YtbsuPPo010,
        ]

        const result = render(
            <Table>
                <CategoryComboTableBody
                    categoryCombo={categoryCombos.dzjKKQq0cSO}
                    dataElements={tableDataElements}
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId('dhis2-dataentry-tableinputrow')
        expect(inputRows.length).toBe(15)

        inputRows.forEach((inputRow, index) => {
            const dataElement = tableDataElements[index]
            const headerCell = getByText(inputRow, dataElement.displayName, {
                selector: '[data-test="dhis2-dataentryapp-dataelementcell"]',
            })

            const inputCells = getAllByTestId(
                inputRow,
                'dhis2-dataentryapp-dataentrycell'
            )

            expect(headerCell).toBeTruthy()
            expect(inputCells.length).toBe(4)
        })
    })

    it('should filter the input rows by displayFormName (filterText)', () => {
        const tableDataElements = [
            dataElements.s46m5MS0hxu,
            dataElements.UOlfIjgN8X6,
            dataElements.z7duEFcpApd,
            dataElements.x3Do5e7g4Qo,
            dataElements.pikOziyCXbM,
            dataElements.O05mAByOgAv,
            dataElements.vI2csg55S9C,
            dataElements.xc8gmAKfO95,
            dataElements.mGN1az8Xub6,
            dataElements.L2kxa2IA2cs,
            dataElements.fClA2Erf6IO,
            dataElements.I78gJm4KBo7,
            dataElements.n6aMJNLdvep,
            dataElements.l6byfWFUGaP,
            dataElements.YtbsuPPo010,
        ]
        const result = render(
            <Table>
                <CategoryComboTableBody
                    categoryCombo={categoryCombos.dzjKKQq0cSO}
                    dataElements={tableDataElements}
                    filterText="doses given"
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRowTestIdRegExp = new RegExp(
            `\\bdhis2-dataentry-tableinputrow\\b`
        )

        const hiddenTestIdRegExp = new RegExp(
            `\\bdhis2-dataentry-tableinputrow-hidden\\b`
        )

        const inputRows = result.getAllByTestId((dataTestAttribute) => {
            const isInputRow = inputRowTestIdRegExp.test(dataTestAttribute)
            const isHidden = hiddenTestIdRegExp.test(dataTestAttribute)
            return isInputRow && !isHidden
        })

        expect(inputRows.length).toBe(13)
    })

    it('should filter the input rows by displayFormName (globalFilterText)', () => {
        const tableDataElements = [
            dataElements.s46m5MS0hxu,
            dataElements.UOlfIjgN8X6,
            dataElements.z7duEFcpApd,
            dataElements.x3Do5e7g4Qo,
            dataElements.pikOziyCXbM,
            dataElements.O05mAByOgAv,
            dataElements.vI2csg55S9C,
            dataElements.xc8gmAKfO95,
            dataElements.mGN1az8Xub6,
            dataElements.L2kxa2IA2cs,
            dataElements.fClA2Erf6IO,
            dataElements.I78gJm4KBo7,
            dataElements.n6aMJNLdvep,
            dataElements.l6byfWFUGaP,
            dataElements.YtbsuPPo010,
        ]
        const result = render(
            <Table>
                <CategoryComboTableBody
                    categoryCombo={categoryCombos.dzjKKQq0cSO}
                    dataElements={tableDataElements}
                    globalFilterText="doses given"
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRowTestIdRegExp = new RegExp(
            `\\bdhis2-dataentry-tableinputrow\\b`
        )

        const hiddenTestIdRegExp = new RegExp(
            `\\bdhis2-dataentry-tableinputrow-hidden\\b`
        )

        const inputRows = result.getAllByTestId((dataTestAttribute) => {
            const isInputRow = inputRowTestIdRegExp.test(dataTestAttribute)
            const isHidden = hiddenTestIdRegExp.test(dataTestAttribute)
            return isInputRow && !isHidden
        })

        expect(inputRows.length).toBe(13)
    })

    it('should disable fields in greyedFields set', () => {
        const tableDataElements = [
            dataElements.s46m5MS0hxu,
            dataElements.UOlfIjgN8X6,
            dataElements.z7duEFcpApd,
            dataElements.x3Do5e7g4Qo,
            dataElements.pikOziyCXbM,
            dataElements.O05mAByOgAv,
            dataElements.vI2csg55S9C,
            dataElements.xc8gmAKfO95,
            dataElements.mGN1az8Xub6,
            dataElements.L2kxa2IA2cs,
            dataElements.fClA2Erf6IO,
            dataElements.I78gJm4KBo7,
            dataElements.n6aMJNLdvep,
            dataElements.l6byfWFUGaP,
            dataElements.YtbsuPPo010,
        ]

        const greyedFields = new Set()
        greyedFields.add('s46m5MS0hxu.Prlt0C1RF0s')
        greyedFields.add('s46m5MS0hxu.psbwp3CQEhs')
        greyedFields.add('s46m5MS0hxu.V6L425pT3A0')
        greyedFields.add('s46m5MS0hxu.hEFKSsPV5et')
        greyedFields.add('UOlfIjgN8X6.Prlt0C1RF0s')
        greyedFields.add('UOlfIjgN8X6.psbwp3CQEhs')
        greyedFields.add('UOlfIjgN8X6.V6L425pT3A0')
        greyedFields.add('UOlfIjgN8X6.hEFKSsPV5et')

        const result = render(
            <Table>
                <CategoryComboTableBody
                    categoryCombo={categoryCombos.dzjKKQq0cSO}
                    dataElements={tableDataElements}
                    greyedFields={greyedFields}
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const disabledInputs = result.getAllByRole((role, element) => {
            return role === 'textbox' && element.disabled
        })

        expect(disabledInputs.length).toBe(8)
    })

    it('should add padding cells when needed', () => {
        const tableDataElements = [dataElements.FTRrcoaog83]

        const result = render(
            <Table>
                <CategoryComboTableBody
                    categoryCombo={categoryCombos.bjDvmb4bfuf}
                    dataElements={tableDataElements}
                    maxColumnsInSection={4}
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper dataValueSet={{}}>
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const paddingCells = result.getAllByTestId(
            'dhis2-dataentry-paddingcell'
        )
        expect(paddingCells.length).toBe(3)
    })

    it('should render the column totals when renderColumTotals = true', () => {
        const tableDataElements = [dataElements.FTRrcoaog83]

        const result = render(
            <Table>
                <CategoryComboTableBody
                    renderColumnTotals
                    categoryCombo={categoryCombos.bjDvmb4bfuf}
                    dataElements={tableDataElements}
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper
                        dataValueSet={{
                            FTRrcoaog83: {
                                HllvX50cXC0: {
                                    value: 5,
                                },
                            },
                        }}
                    >
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const columnTotalsRow = result.getByTestId(
            'dhis2-dataentry-columntotals'
        )
        expect(columnTotalsRow).toBeTruthy()

        const totalCells = result.getAllByText('5', {
            selector: '[data-test="dhis2-dataentry-totalcell"]',
        })
        expect(totalCells.length).toBe(1)
    })

    it('should render the row totals when renderTowTotals = true', () => {
        const tableDataElements = [dataElements.FTRrcoaog83]

        const result = render(
            <Table>
                <CategoryComboTableBody
                    renderRowTotals
                    categoryCombo={categoryCombos.bjDvmb4bfuf}
                    dataElements={tableDataElements}
                />
            </Table>,
            {
                wrapper: ({ children }) => (
                    <FinalFormWrapper
                        dataValueSet={{
                            FTRrcoaog83: {
                                HllvX50cXC0: {
                                    value: 5,
                                },
                            },
                        }}
                    >
                        {children}
                    </FinalFormWrapper>
                ),
            }
        )

        const inputRows = result.getAllByTestId('dhis2-dataentry-tableinputrow')
        expect(inputRows.length).toBe(1)

        const totalCells = getByTestId(
            inputRows[0],
            'dhis2-dataentry-totalcell'
        )
        expect(totalCells).toBeTruthy()
    })
})
