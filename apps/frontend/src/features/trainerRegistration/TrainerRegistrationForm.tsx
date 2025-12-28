'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Backdrop, Box, Button, CircularProgress, Stack } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  getPokemonDetails,
  searchPokemon,
  submitTrainer,
  type PokemonDetails,
  type SearchSuggestion
} from '@/src/lib/api'
import { useDebouncedValue } from '@/src/lib/useDebouncedValue'
import { PokemonAutocompleteField } from './components/PokemonAutocompleteField'
import { PokemonPreviewCard } from './components/PokemonPreviewCard'
import { SuccessDialog } from './components/SuccessDialog'
import { TrainerAgeField } from './components/TrainerAgeField'
import { TrainerNameField } from './components/TrainerNameField'
import {
  trainerRegistrationDefaults,
  trainerRegistrationSchema,
  type TrainerRegistrationFormValues
} from './schema'

export function TrainerRegistrationForm() {
  const [successOpen, setSuccessOpen] = useState(false)
  const [fatalError, setFatalError] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TrainerRegistrationFormValues>({
    resolver: zodResolver(trainerRegistrationSchema),
    defaultValues: trainerRegistrationDefaults,
    mode: 'onBlur'
  })

  const selected = watch('pokemon')
  const hasSelectedPokemon = !!selected?.id && selected.id > 0

  const debounced = useDebouncedValue(searchInput.trim(), 300)

  const suggestionsQuery = useQuery<SearchSuggestion[], Error>({
    queryKey: ['search', debounced] as const,
    queryFn: () => searchPokemon(debounced),
    enabled: debounced.length >= 2,
    staleTime: 60_000
  })

  const options = useMemo(() => suggestionsQuery.data ?? [], [suggestionsQuery.data])

  const pokemonQuery = useQuery<PokemonDetails, Error>({
    queryKey: ['pokemon', selected?.id] as const,
    queryFn: () => getPokemonDetails(selected.id),
    enabled: hasSelectedPokemon,
    staleTime: 5 * 60_000
  })

  const submitMutation = useMutation({
    mutationFn: submitTrainer
  })

  async function onSubmit(values: TrainerRegistrationFormValues) {
    setFatalError(false)
    try {
      await submitMutation.mutateAsync({
        name: values.name,
        age: values.age,
        pokemonId: values.pokemon.id,
        pokemonName: values.pokemon.name
      })
      setSuccessOpen(true)
    } catch {
      setFatalError(true)
    }
  }

  function resetForm() {
    reset(trainerRegistrationDefaults)
    setSearchInput('')
    setFatalError(false)
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <Stack direction="row" spacing={3} sx={{ width: 480 }}>
            <Box sx={{ flex: 1 }}>
              <TrainerNameField control={control} errors={errors} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TrainerAgeField control={control} errors={errors} />
            </Box>
          </Stack>
          <PokemonAutocompleteField
            control={control}
            errors={errors}
            options={options}
            query={suggestionsQuery}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />

          {/* Testing hook: lets component tests set a selected Pokémon without relying on MUI Autocomplete popper behavior in jsdom. */}
          {process.env.NODE_ENV === 'test' ? (
            <input
              type="hidden"
              data-testid="selected-pokemon-id"
              value={selected?.id ?? 0}
              readOnly
            />
          ) : null}

          <Box sx={{ mt: 1 }}>
            {pokemonQuery.isFetching && hasSelectedPokemon ? (
              <Backdrop
                open
                sx={{ position: 'absolute', color: '#fff', zIndex: (t) => t.zIndex.modal + 1 }}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : null}

            {pokemonQuery.data ? <PokemonPreviewCard pokemon={pokemonQuery.data} /> : null}
          </Box>

          {fatalError ? <Alert severity="error">Something went wrong</Alert> : null}

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button variant="outlined" onClick={resetForm} type="button">
              Reset
            </Button>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>

      <SuccessDialog open={successOpen} onClose={() => setSuccessOpen(false)} onReset={resetForm} />
    </>
  )
}
