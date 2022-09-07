import { createCommentLookupFromDataSetValues } from './has-comment-provider.js'

describe('HasCommentProvider - createCommentLookupFromDataSetValues', () => {
    it('produces the expected result for a known input', () => {
        const dataSetValues = {
            UOlfIjgN8X6: {
                V6L425pT3A0: {
                    dataElement: 'UOlfIjgN8X6',
                },
                psbwp3CQEhs: {
                    dataElement: 'UOlfIjgN8X6',
                    comment: 'Comment text A',
                },
                Prlt0C1RF0s: {
                    dataElement: 'UOlfIjgN8X6',
                },
            },
            x3Do5e7g4Qo: {
                hEFKSsPV5et: {
                    dataElement: 'x3Do5e7g4Qo',
                },
                V6L425pT3A0: {
                    dataElement: 'x3Do5e7g4Qo',
                },
                Prlt0C1RF0s: {
                    dataElement: 'x3Do5e7g4Qo',
                },
            },
            vI2csg55S9C: {
                hEFKSsPV5et: {
                    dataElement: 'vI2csg55S9C',
                    comment: 'dsfs',
                },
                Prlt0C1RF0s: {
                    dataElement: 'vI2csg55S9C',
                    comment: 'Comment text B',
                },
            },
            O05mAByOgAv: {
                hEFKSsPV5et: {
                    dataElement: 'O05mAByOgAv',
                },
                V6L425pT3A0: {
                    dataElement: 'O05mAByOgAv',
                },
                psbwp3CQEhs: {
                    dataElement: 'O05mAByOgAv',
                },
                Prlt0C1RF0s: {
                    dataElement: 'O05mAByOgAv',
                },
            },
        }
        const expectedArray = [
            'UOlfIjgN8X6.psbwp3CQEhs',
            'vI2csg55S9C.hEFKSsPV5et',
            'vI2csg55S9C.Prlt0C1RF0s',
        ]
        const actual = createCommentLookupFromDataSetValues(dataSetValues)
        expect(Array.from(actual)).toEqual(expectedArray)
    })
})
