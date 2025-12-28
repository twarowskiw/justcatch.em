'use client'

import { Button, Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '380px',
    height: '176px',
    opacity: 1,
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0px 4px 10px 2px #0000001A'
  }
})

const Title = styled('h2')({
  fontSize: '40px',
  fontWeight: 400,
  margin: 0
})

export function SuccessDialog({
  open,
  onClose,
  onReset
}: {
  open: boolean
  onClose: () => void
  onReset: () => void
}) {
  return (
    <StyledDialog open={open} onClose={onClose} BackdropProps={{ sx: { backgroundColor: '#00000033' } }}>
      <Title>Success</Title>
      <Button
        variant="contained"
        onClick={() => {
          onClose()
          onReset()
        }}
      >
        Reset form
      </Button>
    </StyledDialog>
  )
}
