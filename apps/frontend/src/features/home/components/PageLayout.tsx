'use client'

import { Box, Container, Typography, styled } from '@mui/material'
import type React from 'react'

const AppContainer = styled(Container)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const Form = styled(Box)(({ theme }) => ({
    padding: '32px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.grey[100],
    borderRadius: '2px',
}))

const DateText = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
  width: '100%',
}))

export function PageLayout({
  formattedDate,
  children
}: {
  formattedDate: string
  children: React.ReactNode
}) {
  return (
    <AppContainer>
      <Form>
        <DateText variant="subtitle1">{formattedDate}</DateText>
        {children}
      </Form>
    </AppContainer>
  )
}
