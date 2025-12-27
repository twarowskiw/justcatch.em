'use client'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Trainer registered.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            onClose()
            onReset()
          }}
        >
          Reset form
        </Button>
      </DialogActions>
    </Dialog>
  )
}
