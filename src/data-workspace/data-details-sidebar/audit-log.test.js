import { CustomDataProvider } from '@dhis2/app-runtime'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from '../../test-utils/index.js'
import AuditLog from './audit-log.js'

describe('<AuditLog />', () => {
    it('is collapsed by default', () => {
        const { getByRole } = render(
            <CustomDataProvider options={{ loadForever: true }}>
                <AuditLog itemId="item-1" />
            </CustomDataProvider>
        )

        expect(getByRole('group')).not.toHaveAttribute('open')
    })

    it('renders a loading spinner whilst loading the item auditLog', async () => {
        const { getByRole, container } = render(
            <AuditLog loading itemId="item-1" />
        )

        // Expand
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
        })

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders a placeholder if there are no audit log', async () => {
        const { getByRole, queryByRole, getByText, container } = render(
            <AuditLog audits={[]} />
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

    it('renders the item audit log once loaded', async () => {
        const audits = [
            {
                auditType: 'UPDATE',
                created: new Date('2021-01-01').toISOString(),
                modifiedBy: 'Firstname Lastname',
                value: '19',
            },
            {
                auditType: 'UPDATE',
                created: new Date('2021-02-01').toISOString(),
                modifiedBy: 'Firstname2 Lastname2',
                value: '21',
            },
            {
                auditType: 'DELETE',
                created: new Date('2021-03-01').toISOString(),
                modifiedBy: 'Firstname3 Lastname3',
                value: '',
            },
        ]
        const { getByRole, getAllByRole, queryByRole, getByText, container } =
            render(<AuditLog audits={audits} />)

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(getByRole('list')).toBeInTheDocument()
        expect(getAllByRole('listitem')).toHaveLength(audits.length)

        const firstChangeEl = getByText('Firstname Lastname set to 19', {
            selector: '.entry:nth-child(3):last-child .entryMessage',
        })
        expect(firstChangeEl).toBeInTheDocument()

        const secondChangeEl = getByText(
            'Firstname2 Lastname2 updated to 21 (was 19)',
            { selector: '.entry:nth-child(2) .entryMessage' }
        )
        expect(secondChangeEl).toBeInTheDocument()

        const thirdChangeEl = getByText(
            'Firstname3 Lastname3 deleted (was 21)',
            { selector: '.entry:nth-child(1) .entryMessage' }
        )
        expect(thirdChangeEl).toBeInTheDocument()
    })
})
