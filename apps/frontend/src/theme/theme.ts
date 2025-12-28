'use client'

import { createTheme, type Theme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9445fa',
      dark: '#6f34bc',
      light: '#6f34bc'
    },
    error: {
      main: '#fb4c4c'
    },
    background: {
      default: '#fdfdfd',
      paper: '#fdfdfd'
    },
    text: {
      primary: '#292929',
      secondary: '#7c7c7c'
    },
    grey: {
      100: '#eeeeee',
      200: '#7f7f7f',
    }
  },
  typography: {
    fontFamily:
      'var(--font-ibm-vga), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    subtitle1: {
      color: '#292929'
    }
  },
  shape: {
    borderRadius: 0
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fdfdfd'
        }
      }
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none'
        },
        containedPrimary: {
          backgroundColor: '#9445fa',
          '&:hover': {
            backgroundColor: '#6f34bc'
          },
          '&.Mui-focusVisible': {
            backgroundColor: '#6f34bc'
          }
        },
        outlinedPrimary: {
          borderColor: '#e0e0e0',
          color: '#292929',
          '&:hover': {
            borderColor: '#6f34bc',
            backgroundColor: 'transparent'
          },
          '&.Mui-focusVisible': {
            borderColor: '#6f34bc'
          }
        }
      }
    },

    MuiInputLabel: {
      defaultProps: {
        shrink: true
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          ...theme.typography.subtitle1,
          lineHeight: '20px',
          position: 'relative',
          top: 0,
          left: 0,
          transform: 'none',
          marginBottom: '2px',
          color: '#292929',
          '&.MuiInputLabel-shrink': {
            transform: 'none'
          },
          '&.Mui-focused': {
            color: '#6f34bc'
          },
          '&.Mui-error': {
            color: '#fb4c4c'
          }
        })
      }
    },

    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true
        }
      }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fdfdfd',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#eeeeee',
            top: 0
          },
          '& .MuiOutlinedInput-notchedOutline legend': {
            display: 'none'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6f34bc'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6f34bc'
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fb4c4c'
          }
        },
        input: ({ theme }: { theme: Theme }) => ({
          '&::placeholder': {
            color: theme.palette.grey[200],
            opacity: 1
          }
        })
      }
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          '&.Mui-error': {
            color: '#fb4c4c'
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0
        },
        label: {
          color: '#6f34bc'
        },
        outlined: {
          borderColor: '#e0e0e0'
        }
      }
    }
  }
})
