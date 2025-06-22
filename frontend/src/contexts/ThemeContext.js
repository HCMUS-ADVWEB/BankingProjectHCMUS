import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a', // slate-900
      paper: '#1e293b', // slate-800
    },
    primary: {
      main: '#10b981', // emerald-500
      light: '#34d399', // emerald-400
      dark: '#059669', // emerald-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // cyan-500
      light: '#22d3ee', // cyan-400
      dark: '#0891b2', // cyan-600
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db', // gray-300
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    action: {
      hover: 'rgba(16, 185, 129, 0.2)',
      selected: 'rgba(16, 185, 129, 0.3)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      background: 'linear-gradient(to right, #34d399, #22d3ee)', // emerald-400 to cyan-400
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      color: '#10b981', // emerald-500
    },
    h3: {
      fontWeight: 700,
      color: '#10b981',
    },
    h4: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      color: '#ffffff',
    },
    body1: {
      fontWeight: 500,
      color: '#d1d5db',
    },
    body2: {
      fontWeight: 400,
      color: '#d1d5db',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Global CSS baseline for consistent body styling
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    // Paper component for cards, dialogs, etc.
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    // Button styling for various variants
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            background: 'linear-gradient(to right, #059669, #0891b2)', // Gradient từ yêu cầu
            color: '#ffffff', // Đảm bảo chữ trắng
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #475569, #64748b)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #334155, #475569)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', // Kế thừa từ root
          },
        },
        outlined: {
          borderColor: 'rgba(71, 85, 105, 0.5)',
          color: '#64748b',
          '&:hover': {
            borderColor: '#475569',
            background: 'rgba(71, 85, 105, 0.1)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', // Kế thừa từ root
          },
        },
        text: {
          color: '#64748b',
          '&:hover': {
            background: 'rgba(71, 85, 105, 0.1)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', // Kế thừa từ root
          },
        },
      },
    },

    // Card component styling
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    // AppBar for header navigation
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    // Drawer for sidebar navigation
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    // TextField for input fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(30, 41, 59, 0.3)',
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(16, 185, 129, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#10b981',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#d1d5db',
            '&.Mui-focused': {
              color: '#10b981',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    // Select and MenuItem for dropdowns
    MuiSelect: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 41, 59, 0.3)',
          borderRadius: 8,
          color: '#ffffff',
          '& .MuiSelect-icon': {
            color: '#d1d5db',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    // FormControl and InputLabel for form elements
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#d1d5db',
            '&.Mui-focused': {
              color: '#10b981',
            },
          },
        },
      },
    },
    // Checkbox, Radio, and Switch for form controls
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(16, 185, 129, 0.5)',
          '&.Mui-checked': {
            color: '#10b981',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'rgba(16, 185, 129, 0.5)',
          '&.Mui-checked': {
            color: '#10b981',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: 'rgba(16, 185, 129, 0.5)',
            '&.Mui-checked': {
              color: '#10b981',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              background: 'rgba(16, 185, 129, 0.5)',
            },
          },
          '& .MuiSwitch-track': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    // Slider for range inputs
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#10b981',
          '& .MuiSlider-thumb': {
            background: '#ffffff',
            border: '2px solid #10b981',
          },
          '& .MuiSlider-rail': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
          },
        },
      },
    },
    // Chip for tags and labels
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          fontWeight: 500,
        },
        outlined: {
          borderColor: 'rgba(16, 185, 129, 0.5)',
          color: '#10b981',
          background: 'transparent',
        },
      },
    },
    // Avatar and ListItemAvatar for user icons
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
        },
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 48,
        },
      },
    },
    // Badge for notifications
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: '#10b981',
          color: '#ffffff',
        },
      },
    },
    // Tooltip for hover information
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          color: '#d1d5db',
        },
      },
    },
    // IconButton and Fab for interactive icons
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(to right, #059669, #0891b2)',
          },
        },
      },
    },
    // ToggleButton and ToggleButtonGroup for segmented controls
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textTransform: 'none',
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
        },
      },
    },
    // Accordion for expandable content
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
        },
        expandIconWrapper: {
          color: '#10b981',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
        },
      },
    },
    // Tabs for navigation
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            color: '#d1d5db',
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              color: '#10b981',
            },
          },
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            height: 3,
            borderRadius: 2,
          },
        },
      },
    },
    // Dialog for modals
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
        },
      },
    },
    // Snackbar and Alert for notifications
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            background: 'rgba(30, 41, 59, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            color: '#d1d5db',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
        },
        standardSuccess: {
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
        },
        standardError: {
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
        },
        standardWarning: {
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
        },
        standardInfo: {
          background: 'rgba(6, 182, 212, 0.2)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#22d3ee',
        },
      },
    },
    // Progress indicators
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 8,
        },
        bar: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#10b981',
        },
      },
    },
    // Skeleton for loading states
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // Table components
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background:
            'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#d1d5db',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '& .MuiTablePagination-selectIcon': {
            color: '#10b981',
          },
        },
      },
    },
    // List components
    MuiList: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 41, 59, 0.3)',
          borderRadius: 8,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    // Divider for separating content
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // Menu for dropdowns
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          backdropFilter: 'blur(12px)',
        },
      },
    },
    // Breadcrumbs for navigation
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          color: '#d1d5db',
          '& .MuiBreadcrumbs-separator': {
            color: '#d1d5db',
          },
        },
      },
    },
    // Rating component
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#10b981',
          '& .MuiRating-iconEmpty': {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    // Stepper components
    MuiStepper: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: '#d1d5db',
          '&.Mui-active': {
            color: '#10b981',
          },
          '&.Mui-completed': {
            color: '#34d399',
          },
        },
      },
    },
    // SpeedDial for floating action menus
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(to right, #059669, #0891b2)',
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          background: '#1e293b',
          color: '#d1d5db',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    // Autocomplete for search inputs
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #1e293b, #111827) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
        },
        inputRoot: {
          background: 'rgba(30, 41, 59, 0.3)',
          borderRadius: 8,
          color: '#ffffff',
        },
      },
    },
    // Timeline components
    MuiTimeline: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          background: '#10b981',
          boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    // DatePicker styling
    MuiDatePicker: {
      styleOverrides: {
        root: {
          '& .MuiPickersDay-root': {
            color: '#d1d5db',
            '&.Mui-selected': {
              background: '#10b981',
              color: '#ffffff',
            },
            '&:hover': {
              background: 'rgba(16, 185, 129, 0.1)',
            },
          },
        },
      },
    },
    // Chart components
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          '& .MuiChartsAxis-tickLabel': {
            fill: '#d1d5db',
          },
          '& .MuiChartsAxis-line': {
            stroke: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiChartsLegend: {
      styleOverrides: {
        root: {
          '& .MuiChartsLegend-series': {
            fill: '#d1d5db',
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f3f4f6', // gray-100, nhẹ hơn #f5f5f5 cho cảm giác tươi sáng
      paper: '#ffffff', // giữ trắng cho card, paper
    },
    primary: {
      main: '#10b981', // emerald-500
      light: '#34d399', // emerald-400
      dark: '#059669', // emerald-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // cyan-500
      light: '#22d3ee', // cyan-400
      dark: '#0891b2', // cyan-600
      contrastText: '#ffffff',
    },
    text: {
      primary: '#111827', // gray-900, đậm để dễ đọc
      secondary: '#4b5563', // gray-600, đủ tương phản trên nền trắng
    },
    divider: 'rgba(0, 0, 0, 0.12)', // viền nhạt
    action: {
      hover: 'rgba(16, 185, 129, 0.1)', // xanh nhạt khi hover
      selected: 'rgba(16, 185, 129, 0.2)', // xanh nhạt khi chọn
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      background: 'linear-gradient(to right, #10b981, #06b6d4)', // gradient emerald-500 to cyan-500
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 700,
      color: '#10b981', // emerald-500
    },
    h3: {
      fontWeight: 700,
      color: '#10b981', // emerald-500
    },
    h4: {
      fontWeight: 600,
      color: '#111827', // gray-900, đậm hơn #ffffff
    },
    h5: {
      fontWeight: 600,
      color: '#111827', // gray-900
    },
    h6: {
      fontWeight: 600,
      color: '#111827', // gray-900
    },
    body1: {
      fontWeight: 500,
      color: '#111827', // gray-900, khắc phục khó đọc
    },
    body2: {
      fontWeight: 400,
      color: '#4b5563', // gray-600, đủ tương phản
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#f3f4f6', // đồng bộ với background.default
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // shadow nhẹ
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(71, 85, 105, 0.12)',
            background: 'linear-gradient(to right, #64748b, #475569)', // Gradient xám để đồng bộ
            color: '#ffffff', // Đảm bảo chữ trắng cho gradient nền
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #64748b, #475569)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #475569, #334155)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 4px 12px rgba(71, 85, 105, 0.12)', // Kế thừa từ root
          },
        },
        outlined: {
          borderColor: '#64748b',
          color: '#475569',
          '&:hover': {
            borderColor: '#475569',
            background: 'rgba(71, 85, 105, 0.08)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 4px 12px rgba(71, 85, 105, 0.12)', // Kế thừa từ root
          },
        },
        text: {
          color: '#475569',
          '&:hover': {
            background: 'rgba(71, 85, 105, 0.08)',
            transform: 'scale(1.05)', // Kế thừa từ root
            boxShadow: '0 4px 12px rgba(71, 85, 105, 0.12)', // Kế thừa từ root
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#ffffff',
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.15)',
            },
            '&:hover fieldset': {
              borderColor: '#10b981',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#10b981',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#4b5563',
            '&.Mui-focused': {
              color: '#10b981',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#111827',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderRadius: 8,
          color: '#111827',
          '& .MuiSelect-icon': {
            color: '#4b5563',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#111827',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#4b5563',
            '&.Mui-focused': {
              color: '#10b981',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 0.3)',
          '&.Mui-checked': {
            color: '#10b981',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 0.3)',
          '&.Mui-checked': {
            color: '#10b981',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: 'rgba(0, 0, 0, 0.3)',
            '&.Mui-checked': {
              color: '#10b981',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              background: 'rgba(16, 185, 129, 0.5)',
            },
          },
          '& .MuiSwitch-track': {
            background: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#10b981',
          '& .MuiSlider-thumb': {
            background: '#ffffff',
            border: '2px solid #10b981',
          },
          '& .MuiSlider-rail': {
            background: 'rgba(0, 0, 0, 0.2)',
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#10b981',
          color: '#10b981',
          background: 'transparent',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: '#10b981',
          color: '#ffffff',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#111827',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
          color: '#ffffff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(to right, #059669, #0891b2)',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          textTransform: 'none',
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: '#111827',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
        },
        expandIconWrapper: {
          color: '#10b981',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          color: '#4b5563',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            color: '#4b5563',
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              color: '#10b981',
            },
          },
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            height: 3,
            borderRadius: 2,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#111827',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#4b5563',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 8,
            color: '#111827',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
        standardError: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
        },
        standardWarning: {
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#f59e0b',
        },
        standardInfo: {
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          color: '#06b6d4',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
        bar: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#10b981',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'rgba(16, 185, 129, 0.05)',
          '& .MuiTableCell-head': {
            color: '#111827',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.05)',
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            color: '#4b5563',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          '& .MuiTablePagination-selectIcon': {
            color: '#10b981',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderRadius: 8,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          '& .MuiBreadcrumbs-separator': {
            color: '#4b5563',
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#10b981',
          '& .MuiRating-iconEmpty': {
            color: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: '#4b5563',
          '&.Mui-active': {
            color: '#10b981',
          },
          '&.Mui-completed': {
            color: '#34d399',
          },
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          background: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(to right, #059669, #0891b2)',
          },
        },
      },
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {
          background: '#ffffff',
          color: '#4b5563',
          '&:hover': {
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        },
        inputRoot: {
          background: '#ffffff',
          borderRadius: 8,
          color: '#111827',
        },
      },
    },
    MuiTimeline: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          background: '#10b981',
          boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)',
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDatePicker: {
      styleOverrides: {
        root: {
          '& .MuiPickersDay-root': {
            color: '#4b5563',
            '&.Mui-selected': {
              background: '#10b981',
              color: '#ffffff',
            },
            '&:hover': {
              background: 'rgba(16, 185, 129, 0.1)',
            },
          },
        },
      },
    },
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          '& .MuiChartsAxis-tickLabel': {
            fill: '#4b5563',
          },
          '& .MuiChartsAxis-line': {
            stroke: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiChartsLegend: {
      styleOverrides: {
        root: {
          '& .MuiChartsLegend-series': {
            fill: '#4b5563',
          },
        },
      },
    },
  },
});

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
