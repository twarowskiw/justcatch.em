import { z } from 'zod'

export const trainerRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be 2-20 characters')
    .max(20, 'Name must be 2-20 characters'),
  age: z
    .number({ invalid_type_error: 'Age is required' })
    .int('Age must be a whole number')
    .min(16, 'Age must be 16-99')
    .max(99, 'Age must be 16-99'),
  pokemon: z
    .object({
      id: z.number(),
      name: z.string()
    })
    .refine((p) => p.id > 0 && p.name.trim().length > 0, {
      message: 'Pokémon is required'
    })
})

export type TrainerRegistrationFormValues = z.infer<typeof trainerRegistrationSchema>

export const trainerRegistrationDefaults: Partial<TrainerRegistrationFormValues> = {
  name: '',
  age: undefined,
  pokemon: { id: 0, name: '' }
}
