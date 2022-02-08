import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
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
            <CustomDataProvider options={{ loadForever: true }}>
                <AuditLog itemId="item-1" />
            </CustomDataProvider>
        )

        // Expand
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
        })

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    it('renders an error message if the audit log could not be loaded', async () => {
        const { getByRole, queryByRole, container } = render(
            <CustomDataProvider options={{ failOnMiss: true }}>
                <AuditLog itemId="item-1" />
            </CustomDataProvider>
        )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(
            getByRole('heading', {
                name: 'There was a problem loading the audit log for this data item',
            })
        ).toBeInTheDocument()
    })

    it('renders a placeholder if there are no audit log', async () => {
        const mockData = {
            auditLog: null,
        }
        const { getByRole, queryByRole, getByText, container } = render(
            <CustomDataProvider data={mockData} options={{ failOnMiss: false }}>
                <AuditLog itemId="item-1" />
            </CustomDataProvider>
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
        const mockData = {
            auditLog: [
                {
                    displayName: 'Firstname Lastname',
                    changeType: 'UPDATE',
                    newValue: '19',
                    oldValue: '13',
                    at: new Date('2021-01-01'),
                },
                {
                    displayName: 'Firstname2 Lastname2',
                    changeType: 'DELETE',
                    oldValue: '15',
                    at: new Date('2021-02-01'),
                },
            ],
        }
        const { getByRole, getAllByRole, queryByRole, getByText, container } =
            render(
                <CustomDataProvider data={mockData}>
                    <AuditLog itemId="item-1" />
                </CustomDataProvider>
            )

        // Expand and wait for data to load
        userEvent.click(container.querySelector('summary'))
        await waitFor(() => {
            expect(getByRole('group')).toHaveAttribute('open')
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
        })

        expect(getByRole('list')).toBeInTheDocument()
        expect(getAllByRole('listitem')).toHaveLength(mockData.auditLog.length)
        for (const entry of mockData.auditLog) {
            expect(
                getByText(entry.displayName, { exact: false })
            ).toBeInTheDocument()
            expect(
                getByText(entry.oldValue, { exact: false })
            ).toBeInTheDocument()
            if (entry.newValue) {
                expect(
                    getByText(entry.newValue, { exact: false })
                ).toBeInTheDocument()
            }
            expect(
                getByText(entry.changeType, { exact: false })
            ).toBeInTheDocument()
        }
    })
})
