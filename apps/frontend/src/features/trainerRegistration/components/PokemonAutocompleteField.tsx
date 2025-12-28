'use client'

import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
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
  const emptySuggestion: SearchSuggestion = { id: 0, name: '', score: 0 }
  const [open, setOpen] = useState(false)
  const ChevronDown = ({ sx }: { sx?: any }) => (
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 1.05969L0.971256 0L6.66667 6.21396L12.3621 0L13.3333 1.05969L6.66667 8.33333L0 1.05969Z" fill="#2A2A2A"/>
    </svg>
  )

  const ChevronUp = ({ sx }: { sx?: any }) => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M13.3334 7.27357L12.3621 8.33325L6.66671 2.11929L0.971298 8.33325L4.0147e-05 7.27356L6.66671 -8.25988e-05L13.3334 7.27357Z" fill="#2A2A2A"/>
  </svg>
  )
  return (
    <Controller
      control={control}
      name="pokemon"
      render={({ field }) => (
        <Autocomplete<SearchSuggestion, false, true, false>
          disableClearable
          value={
            field.value?.id
              ? ({ id: field.value.id, name: field.value.name, score: 0 } as SearchSuggestion)
              : emptySuggestion
          }
          onChange={(_, v) => {
            if (!v || v.id <= 0) {
              field.onChange({ id: 0, name: '' })
              setSearchInput('')
              return
            }

            field.onChange({ id: v.id, name: v.name })
            setSearchInput(v.name)
          }}
          inputValue={searchInput}
          onInputChange={(_, v, reason) => {
            if (reason === 'input' || reason === 'clear') setSearchInput(v)
          }}
          options={options}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(a, b) => b.id > 0 && a.id === b.id}
          loading={query.isFetching}
          popupIcon={null}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pokemon name"
              placeholder="Choose"
              error={!!errors.pokemon}
              helperText={errors.pokemon?.message}
              fullWidth
              InputProps={{
                ...params.InputProps,
                style: { paddingRight: 10 },
                endAdornment: (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20 }}>
                    {query.isFetching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : open ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                )
              }}
            />
          )}
        />
      )}
    />
  )
}
