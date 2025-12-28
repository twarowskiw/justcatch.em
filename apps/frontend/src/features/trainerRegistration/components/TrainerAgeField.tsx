'use client'

import { TextField } from '@mui/material'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { TrainerRegistrationFormValues } from '../schema'

export function TrainerAgeField({
  control,
  errors
}: {
  control: Control<TrainerRegistrationFormValues>
  errors: FieldErrors<TrainerRegistrationFormValues>
}) {
  return (
    <Controller
      control={control}
      name="age"
      render={({ field }) => (
        <TextField
          label="Trainer's age"
          placeholder="Trainer's age"
          type="text"
          inputMode="numeric"
          value={Number.isFinite(field.value) ? String(field.value) : ''}
          onChange={(e) =>
            field.onChange(e.target.value === '' ? e.target.value : Number(e.target.value))
          }
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={!!errors.age}
          helperText={errors.age?.message}
          fullWidth
          inputProps={{ min: 16, max: 99 }}
        />
      )}
    />
  )
}
