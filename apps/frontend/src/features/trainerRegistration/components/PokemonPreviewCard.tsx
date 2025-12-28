'use client'

import { Box, Chip, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import type { PokemonDetails } from '@/src/lib/api'
import { theme } from '@/src/theme/theme'

export function PokemonPreviewCard({ pokemon }: { pokemon: PokemonDetails | undefined }) {
  const capitalize = (s?: string) => (s && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : '')
  return (
    <Box
      sx={{
        width: 480,
        height: 254,
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        borderRadius: '2px',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {!pokemon ? (
        <Typography variant="body2" sx={(t) => ({ fontSize: 12, color: t.palette.grey[200] })}>
          Your pokemon
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: 194,
              height: 196,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              bgcolor: 'background.default'
            }}
          >
            {pokemon.imageUrl ? (
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.name}
                width={194}
                height={196}
                style={{ objectFit: 'contain' }}
                sizes="194px"
                priority
              />
            ) : (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                No image
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography variant="body1">
              Name: {capitalize(pokemon.name)}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1">
                Type:
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pokemon.types.map((t) => (
                  <Box
                    key={t}
                    sx={(theme) => ({
                      backgroundColor: theme.palette.primary.light,
                      borderRadius: '16px',
                      px: 1.5,
                      py: 0.5,
                      display: 'inline-flex',
                      alignItems: 'center'
                    })}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: 12, color: '#000' }}>
                      {capitalize(t)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Typography variant="body1">
              Base experience: {pokemon.baseExperience}
            </Typography>

            <Typography variant="body1">
              Id: {pokemon.id}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
