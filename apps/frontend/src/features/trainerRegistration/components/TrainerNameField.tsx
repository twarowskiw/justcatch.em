'use client'

import { TextField } from '@mui/material'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { TrainerRegistrationFormValues } from '../schema'

export function TrainerNameField({
  control,
  errors
}: {
  control: Control<TrainerRegistrationFormValues>
  errors: FieldErrors<TrainerRegistrationFormValues>
}) {
  return (
    <Controller
      control={control}
      name="name"
      render={({ field }) => (
        <TextField
          label="Trainer's name"
          placeholder="Trainer's name"
          {...field}
          error={!!errors.name}
          helperText={errors.name?.message}
          inputProps={{ maxLength: 20 }}
          fullWidth
        />
      )}
    />
  )
}
