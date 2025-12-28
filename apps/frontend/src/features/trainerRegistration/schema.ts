import { z } from 'zod'

export const trainerRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Required from 2 to 20 symbols')
    .max(20, 'Required from 2 to 20 symbols'),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(16, 'Required range from 16-99')
    .max(99, 'Required range from 16-99'),
  pokemon: z
    .object({
      id: z.number(),
      name: z.string()
    })
    .refine((p) => p.id > 0 && p.name.trim().length > 0, {
      message: 'Choose something',
    })
})

export type TrainerRegistrationFormValues = z.infer<typeof trainerRegistrationSchema>

export const trainerRegistrationDefaults: Partial<TrainerRegistrationFormValues> = {
  name: '',
  age: undefined,
  pokemon: { id: 0, name: '' }
}
