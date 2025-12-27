'use client'

import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { SearchSuggestion } from '@/src/lib/api'
import type { TrainerRegistrationFormValues } from '../schema'

export function PokemonAutocompleteField({
  control,
  errors,
  options,
  query,
  searchInput,
  setSearchInput
}: {
  control: Control<TrainerRegistrationFormValues>
  errors: FieldErrors<TrainerRegistrationFormValues>
  options: SearchSuggestion[]
  query: UseQueryResult<SearchSuggestion[], Error>
  searchInput: string
  setSearchInput: (next: string) => void
}) {
  return (
    <Controller
      control={control}
      name="pokemon"
      render={({ field }) => (
        <Autocomplete<SearchSuggestion, false, false, false>
          value={
            field.value?.id
              ? ({ id: field.value.id, name: field.value.name, score: 0 } as SearchSuggestion)
              : null
          }
          onChange={(_, v) => {
            if (!v) field.onChange({ id: 0, name: '' })
            else field.onChange({ id: v.id, name: v.name })
          }}
          inputValue={searchInput}
          onInputChange={(_, v) => setSearchInput(v)}
          options={options}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          loading={query.isFetching}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pokémon name"
              error={!!errors.pokemon}
              helperText={errors.pokemon?.message}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {query.isFetching ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      )}
    />
  )
}
