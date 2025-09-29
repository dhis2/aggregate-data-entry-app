import { useConfig } from '@dhis2/app-runtime'
import { waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from '../../test-utils/index.js'
import AuditLog from './audit-log.jsx'
import useDataValueContext from './use-data-value-context.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        systemInfo: { serverTimeZoneId: 'Etc/UTC', calendar: 'gregory' },
    })),
}))

jest.mock('./use-data-value-context.js', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('<AuditLog />', () => {
    const item = {
        categoryOptionCombo: 'coc-id',
        dataElement: 'de-id',
        comment: 'This is a comment',
    }

    afterEach(() => {
        jest.clearAllMocks()
        useDataValueContext.mockClear()
    })

    it('is collapsed by default', () => {
        useDataValueContext.mockImplementation(() => ({}))
        const { getByRole } = render(<AuditLog item={item} />)
        expect(getByRole('group')).not.toHaveAttribute('open')
    })

    it('renders a loading spinner whilst loading the item auditLog', async () => {
        useDataValueContext.mockImplementation(() => ({
            isLoading: true,
        }))

        const { getByRole, container } = render(<AuditLog item={item} />)

        // Expand
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
        })

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders a placeholder if there are no audit log', async () => {
        useDataValueContext.mockImplementation(() => ({
            isLoading: false,
            data: { audits: [] },
        }))

        const { getByRole, queryByRole, getByText, container } = render(
            <AuditLog item={item} />
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByText('No audit log for this data item.')
        ).toBeInTheDocument()
    })

    // @TODO: Enable and fix when working on:
    // https://dhis2.atlassian.net/browse/TECH-1281
    it('renders the item audit log once loaded', async () => {
        const audits = [
            {
                auditType: 'DELETE',
                created: new Date('2021-03-01').toISOString(),
                modifiedBy: 'Firstname Lastname',
                value: '21',
            },
            {
                auditType: 'UPDATE',
                created: new Date('2021-02-01').toISOString(),
                modifiedBy: 'Firstname2 Lastname2',
                value: '21',
            },
            {
                auditType: 'UPDATE',
                created: new Date('2021-01-01').toISOString(),
                modifiedBy: 'Firstname3 Lastname3',
                value: '19',
            },
        ]

        const data = { audits }
        useDataValueContext.mockImplementation(() => ({
            isLoading: false,
            data,
        }))

        const { getByRole, getAllByRole, queryByRole, getByText, container } =
            render(<AuditLog item={item} />)

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        // the number of rows is: the length of audits + 1 (for header row)
        const auditRows = getAllByRole('row')

        expect(auditRows).toHaveLength(audits.length + 1)

        const firstChangeName = within(auditRows[1]).getByText(
            'Firstname Lastname',
            {}
        )
        expect(firstChangeName).toBeInTheDocument()
        const firstChangeValue = within(auditRows[1]).getByText('21', {})
        expect(firstChangeValue).toBeInTheDocument()

        const secondChangeName = within(auditRows[2]).getByText(
            'Firstname2 Lastname2',
            {}
        )
        expect(secondChangeName).toBeInTheDocument()
        const secondChangeValue = within(auditRows[2]).getByText('21', {})
        expect(secondChangeValue).toBeInTheDocument()
        expect(auditRows[2].textContent).toContain('→21')

        const thirdChangeName = within(auditRows[3]).getByText(
            'Firstname3 Lastname3',
            {}
        )
        expect(thirdChangeName).toBeInTheDocument()
        const thirdChangeValue = within(auditRows[3]).getByText('19', {})
        expect(thirdChangeValue).toBeInTheDocument()
        expect(auditRows[3].textContent).toContain('→19')

        // check that note about time zone appears
        expect(
            getByText('audit dates are given in UTC time')
        ).toBeInTheDocument()

        // check that warning about limited audit history appears
        expect(
            getByText('log displays only changes made while audit was enabled')
        ).toBeInTheDocument()
    })

    it('renders the date/datetime values in system calendar (ethiopian)', async () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                calendar: 'ethiopian',
            },
        }))
        const audits = [
            {
                auditType: 'DELETE',
                created: new Date('2021-03-01').toISOString(),
                modifiedBy: 'Firstname Lastname',
                value: '2021-09-10',
            },
            {
                auditType: 'UPDATE',
                created: new Date('2021-02-01').toISOString(),
                modifiedBy: 'Firstname2 Lastname2',
                value: '2021-09-11',
            },
        ]

        const dateItem = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
            valueType: 'DATE',
        }

        const data = { audits }
        useDataValueContext.mockImplementation(() => ({
            isLoading: false,
            data,
        }))

        const { getByRole, getAllByRole, queryByRole, container } = render(
            <AuditLog item={dateItem} />
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        // the number of rows is: the length of audits + 1 (for header row)
        const auditRows = getAllByRole('row')

        expect(auditRows).toHaveLength(audits.length + 1)

        const firstChangeName = within(auditRows[1]).getByText(
            'Firstname Lastname',
            {}
        )
        expect(firstChangeName).toBeInTheDocument()
        const firstChangeValue = within(auditRows[1]).getByText(
            '2013-13-05',
            {}
        )
        expect(firstChangeValue).toBeInTheDocument()

        const secondChangeName = within(auditRows[2]).getByText(
            'Firstname2 Lastname2',
            {}
        )
        expect(secondChangeName).toBeInTheDocument()
        const secondChangeValue = within(auditRows[2]).getByText(
            '2014-01-01',
            {}
        )
        expect(secondChangeValue).toBeInTheDocument()
    })

    it('renders the date/datetime values in system calendar (gregorian)', async () => {
        useConfig.mockImplementation(() => ({
            systemInfo: {
                calendar: 'gregory',
            },
        }))
        const audits = [
            {
                auditType: 'DELETE',
                created: new Date('2021-03-01').toISOString(),
                modifiedBy: 'Firstname Lastname',
                value: '2021-09-10',
            },
            {
                auditType: 'UPDATE',
                created: new Date('2021-02-01').toISOString(),
                modifiedBy: 'Firstname2 Lastname2',
                value: '2021-09-11',
            },
        ]

        const dateItem = {
            categoryOptionCombo: 'coc-id',
            dataElement: 'de-id',
            comment: 'This is a comment',
            valueType: 'DATE',
        }

        const data = { audits }
        useDataValueContext.mockImplementation(() => ({
            isLoading: false,
            data,
        }))

        const { getByRole, getAllByRole, queryByRole, container } = render(
            <AuditLog item={dateItem} />
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        // the number of rows is: the length of audits + 1 (for header row)
        const auditRows = getAllByRole('row')

        expect(auditRows).toHaveLength(audits.length + 1)

        const firstChangeName = within(auditRows[1]).getByText(
            'Firstname Lastname',
            {}
        )
        expect(firstChangeName).toBeInTheDocument()
        const firstChangeValue = within(auditRows[1]).getByText(
            '2021-09-10',
            {}
        )
        expect(firstChangeValue).toBeInTheDocument()

        const secondChangeName = within(auditRows[2]).getByText(
            'Firstname2 Lastname2',
            {}
        )
        expect(secondChangeName).toBeInTheDocument()
        const secondChangeValue = within(auditRows[2]).getByText(
            '2021-09-11',
            {}
        )
        expect(secondChangeValue).toBeInTheDocument()
    })
})
