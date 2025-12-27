'use client'

import { Box, Chip, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import type { PokemonDetails } from '@/src/lib/api'

export function PokemonPreviewCard({ pokemon }: { pokemon: PokemonDetails }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 2,
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          border: '1px solid',
          borderColor: 'divider',
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
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
            sizes="120px"
            priority
          />
        ) : (
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            No image
          </Typography>
        )}
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={2}>
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {pokemon.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            #{pokemon.id}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          {pokemon.types.map((t) => (
            <Chip key={t} label={t} size="small" />
          ))}
        </Stack>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Base experience: {pokemon.baseExperience}
        </Typography>
      </Box>
    </Box>
  )
}
