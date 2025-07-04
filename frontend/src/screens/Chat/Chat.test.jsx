import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { BrowserRouter } from 'react-router-dom'
import Chat from './Chat'

describe('Proposal Drafter – Form validation', () => {
        it('disables the Generate button until all required inputs are filled', async () => {
                render(
                        <BrowserRouter>
                                <Chat />
                        </BrowserRouter>
                )

                const generateButton = screen.getByRole('button', { name: /generate/i })
                expect(generateButton).toBeDisabled()

                const textarea = screen.getByPlaceholderText(/enter your project requirements/i)
                await userEvent.type(textarea, 'School for the disabled in New York')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const projectTitleInput = screen.getByLabelText(/^Project title/i)
                await userEvent.type(projectTitleInput, 'Accessible School')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const projectTypeInput = screen.getByLabelText(/^Project type/i)
                await userEvent.type(projectTypeInput, 'Infra')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const geographicalCoverageInput = screen.getByLabelText(/geographical coverage/i)
                await userEvent.type(geographicalCoverageInput, 'NYC, US, NA')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const executingAgencyInput = screen.getByLabelText(/executing agency/i)
                await userEvent.type(executingAgencyInput, 'IOM')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const beneficiariesInput = screen.getByLabelText(/beneficiaries/i)
                await userEvent.type(beneficiariesInput, 'Disabled individuals')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const partnersInput = screen.getByLabelText(/partner/i)
                await userEvent.type(partnersInput, 'UN')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const managementSiteInput = screen.getByLabelText(/management site/i)
                await userEvent.type(managementSiteInput, 'IOM NYC')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const durationInput = screen.getByLabelText(/duration/i)
                await userEvent.type(durationInput, '5Y')
                await waitFor(() => expect(generateButton).toBeDisabled())

                const budgetInput = screen.getByLabelText(/budget/i)
                await userEvent.type(budgetInput, '$3M')
                await waitFor(() => expect(generateButton).toBeEnabled())

                const secondaryProjectTypeInput = screen.getByLabelText(/secondary project type/i)
                await userEvent.type(secondaryProjectTypeInput, 'Edu')
                await waitFor(() => expect(generateButton).toBeEnabled())
        })
})

describe('Proposal Drafter – One‑Section Generation Flow', () => {
        it('calls process_section with session and body, renders all cards', async () => {
                render(
                        <BrowserRouter>
                                <Chat />
                        </BrowserRouter>
                )

                await userEvent.type(screen.getByPlaceholderText(/enter your project requirements/i), 'School for the disabled in New York')
                await userEvent.type(screen.getByLabelText(/^project title/i), 'Accessible School')
                await userEvent.type(screen.getByLabelText(/^project type/i), 'Infra')
                await userEvent.type(screen.getByLabelText(/secondary project type/i), 'Edu')
                await userEvent.type(screen.getByLabelText(/geographical coverage/i), 'NYC, US, NA')
                await userEvent.type(screen.getByLabelText(/executing agency/i), 'IOM')
                await userEvent.type(screen.getByLabelText(/beneficiaries/i), 'Disabled individuals')
                await userEvent.type(screen.getByLabelText(/partner/i), 'UN')
                await userEvent.type(screen.getByLabelText(/management site/i), 'IOM NYC')
                await userEvent.type(screen.getByLabelText(/duration/i), '5Y')
                await userEvent.type(screen.getByLabelText(/budget/i), '$3M')

                await userEvent.click(screen.getByRole('button', { name: /generate/i }))

                const sections = ['Summary','Rationale','Project Description', "Partnerships and Coordination", "Monitoring", "Evaluation"]

                for (const sec of sections) {
                        const card = await screen.findByText(new RegExp(`Mocked text for ${sec}`, 'i'), { timeout: 10000 });
                        expect(card).toBeInTheDocument();
                }
        })

        it('allows editing Summary content', async () => {
                render(
                        <BrowserRouter>
                                <Chat />
                        </BrowserRouter>
                )

                await userEvent.type(screen.getByPlaceholderText(/enter your project requirements/i), 'School for the disabled in New York')
                await userEvent.type(screen.getByLabelText(/^project title/i), 'Accessible School')
                await userEvent.type(screen.getByLabelText(/^project type/i), 'Infra')
                await userEvent.type(screen.getByLabelText(/secondary project type/i), 'Edu')
                await userEvent.type(screen.getByLabelText(/geographical coverage/i), 'NYC, US, NA')
                await userEvent.type(screen.getByLabelText(/executing agency/i), 'IOM')
                await userEvent.type(screen.getByLabelText(/beneficiaries/i), 'Disabled individuals')
                await userEvent.type(screen.getByLabelText(/partner/i), 'UN')
                await userEvent.type(screen.getByLabelText(/management site/i), 'IOM NYC')
                await userEvent.type(screen.getByLabelText(/duration/i), '5Y')
                await userEvent.type(screen.getByLabelText(/budget/i), '$3M')

                await userEvent.click(screen.getByRole('button', { name: /generate/i }))

                const sections = ['Summary','Rationale','Project Description', "Partnerships and Coordination", "Monitoring", "Evaluation"]

                for (const sec of sections) {
                        const card = await screen.findByText(new RegExp(`Mocked text for ${sec}`, 'i'), { timeout: 10000 });
                        expect(card).toBeInTheDocument();
                }

                const editButton = screen.getByLabelText('edit-section-0')
                expect(editButton).toBeInTheDocument()

                await userEvent.click(editButton)

                const editor = screen.getByRole('textbox', { name: /editor for Summary/i })
                expect(editor).toBeInTheDocument()
                expect(editor).toHaveValue('Mocked text for Summary')

                await userEvent.clear(editor)
                await userEvent.type(editor, 'Custom Summary Text')

                await userEvent.click(editButton)

                const regenerated = await screen.findByText(/Custom Summary Text/i)
                expect(regenerated).toBeInTheDocument()
        }),

        it('finalizes proposal on Approve click and locks editing in Chat', async () => {
                render(
                        <BrowserRouter>
                                <Chat />
                        </BrowserRouter>
                )

                await userEvent.type(screen.getByPlaceholderText(/enter your project requirements/i), 'School for the disabled in New York')
                await userEvent.type(screen.getByLabelText(/^project title/i), 'Accessible School')
                await userEvent.type(screen.getByLabelText(/^project type/i), 'Infra')
                await userEvent.type(screen.getByLabelText(/secondary project type/i), 'Edu')
                await userEvent.type(screen.getByLabelText(/geographical coverage/i), 'NYC, US, NA')
                await userEvent.type(screen.getByLabelText(/executing agency/i), 'IOM')
                await userEvent.type(screen.getByLabelText(/beneficiaries/i), 'Disabled individuals')
                await userEvent.type(screen.getByLabelText(/partner/i), 'UN')
                await userEvent.type(screen.getByLabelText(/management site/i), 'IOM NYC')
                await userEvent.type(screen.getByLabelText(/duration/i), '5Y')
                await userEvent.type(screen.getByLabelText(/budget/i), '$3M')

                await userEvent.click(screen.getByRole('button', { name: /generate/i }))

                const sections = ['Summary','Rationale','Project Description', "Partnerships and Coordination", "Monitoring", "Evaluation"]

                for (const sec of sections) {
                        const card = await screen.findByText(new RegExp(`Mocked text for ${sec}`, 'i'), { timeout: 10000 });
                        expect(card).toBeInTheDocument();
                }

                sessionStorage.setItem('proposal_id', 'approved-proposal-123')

                const approveButton = await screen.findByRole('button', { name: /approve/i })
                await userEvent.click(approveButton)

                await waitFor(() => {
                        expect(screen.queryByPlaceholderText(/enter your project requirements/i)).toBeNull()
                        expect(screen.queryByRole('button', { name: /generate/i })).toBeNull()

                        const opts = screen.queryAllByTestId(/section-options-/)
                        for (const container of opts) {
                                const { queryByRole } = within(container)
                                expect(queryByRole('button', { name: /^Regenerate$/i })).toBeNull()
                        }
                })
        })
})
