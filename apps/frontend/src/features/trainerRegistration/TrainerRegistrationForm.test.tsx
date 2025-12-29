import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TrainerRegistrationForm } from './TrainerRegistrationForm'
import { theme } from '@/src/theme/theme'

// For component tests, mock network functions to avoid fighting MUI Autocomplete popper + timers.
vi.mock('@/src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/src/lib/api')>('@/src/lib/api')
  return {
    ...actual,
    searchPokemon: vi.fn(async () => [{ id: 25, name: 'pikachu', score: 99 }]),
    getPokemonDetails: vi.fn(async () => ({
      id: 25,
      name: 'pikachu',
      baseExperience: 112,
      imageUrl: 'https://example.test/pikachu.png',
      types: ['electric']
    })),
    submitTrainer: vi.fn(async () => undefined)
  }
})

// Replace the Pokemon autocomplete field with a deterministic button that selects pikachu.
vi.mock('./components/PokemonAutocompleteField', async () => {
  const actual = await vi.importActual<typeof import('./components/PokemonAutocompleteField')>(
    './components/PokemonAutocompleteField'
  )
  return {
    ...actual,
    PokemonAutocompleteField: ({ control }: { control: any }) => {
      // Lazy import to avoid circular deps in module factory.
      const React = require('react')
      const { Controller } = require('react-hook-form')
      return React.createElement(Controller, {
        control,
        name: 'pokemon',
        render: ({ field }: any) =>
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => field.onChange({ id: 25, name: 'pikachu' })
            },
            'Select pikachu'
          )
      })
    }
  }
})

function renderForm() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
  })

  return render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={qc}>
        <TrainerRegistrationForm />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

describe('TrainerRegistrationForm', () => {
  it('shows validation errors and does not submit when invalid', async () => {
    renderForm()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // name field validates on blur (mode: onBlur); force blur to show errors
    fireEvent.blur(screen.getByLabelText(/trainer's name/i))
    fireEvent.blur(screen.getByLabelText(/trainer's age/i))

    expect(await screen.findByText(/from 2 to 20 symbols/i)).toBeInTheDocument()
    // Autocomplete field is mocked to a button in this test file.
    expect(screen.getByRole('button', { name: /select pikachu/i })).toBeInTheDocument()

    // Ensure the success modal did NOT open.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it(
    'submits successfully, shows modal, and reset clears fields',
    async () => {
    renderForm()

    fireEvent.change(screen.getByLabelText(/trainer's name/i), { target: { value: 'Ash' } })
    fireEvent.blur(screen.getByLabelText(/trainer's name/i))

    fireEvent.change(screen.getByLabelText(/trainer's age/i), { target: { value: '18' } })
    fireEvent.blur(screen.getByLabelText(/trainer's age/i))
  fireEvent.click(screen.getByRole('button', { name: /select pikachu/i }))

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /reset form/i }))

    // Reset should clear name value.
    await waitFor(() => {
      expect(screen.getByLabelText(/trainer's name/i)).toHaveValue('')
    })
    },
    10_000
  )
})
