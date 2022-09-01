import processAudits from './process-audits.js'

/*
 * 1. Cell is empty, never had a value
 * 2. User sets the value to 1 and syncs
 * 3. User deletes the value and syncs
 * 4. User sets the value to 2 and syncs
 * 5. User sets the value to 3 and syncs
 */
test('processAudits', () => {
    const audits = [
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '3',
            modifiedBy: 'admin',
            created: '2022-07-07T11:02:00.440',
            auditType: 'UPDATE',
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '2',
            modifiedBy: 'admin',
            created: '2022-07-07T11:01:21.915',
            auditType: 'UPDATE',
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '1',
            modifiedBy: 'admin',
            created: '2022-07-07T10:59:24.260',
            auditType: 'DELETE',
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '1',
            modifiedBy: 'admin',
            created: '2022-07-06T09:00:00.000',
            auditType: 'CREATE',
        },
    ]

    const processedAudits = processAudits(audits)

    expect(processedAudits).toEqual([
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '3',
            modifiedBy: 'admin',
            created: '2022-07-07T11:02:00.440',
            auditType: 'UPDATE',
            previousValue: '2',
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '2',
            modifiedBy: 'admin',
            created: '2022-07-07T11:01:21.915',
            auditType: 'UPDATE',
            previousValue: undefined,
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '1',
            modifiedBy: 'admin',
            created: '2022-07-07T10:59:24.260',
            auditType: 'DELETE',
            previousValue: '1',
        },
        {
            dataElement: 'pikOziyCXbM',
            period: '202206',
            orgUnit: 'ImspTQPwCqd',
            categoryOptionCombo: 'Prlt0C1RF0s',
            value: '1',
            modifiedBy: 'admin',
            created: '2022-07-06T09:00:00.000',
            auditType: 'CREATE',
            previousValue: undefined,
        },
    ])
})
