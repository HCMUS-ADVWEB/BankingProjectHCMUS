import React, { useState } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import {
  ListItemAvatar,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Chip,
  Avatar,
  Badge,
  Tooltip,
  IconButton,
  Fab,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  AppBar,
  Toolbar,
  Menu,
  Breadcrumbs,
  Link,
  Rating,
  Stepper,
  Step,
  StepLabel,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Autocomplete,
} from '@mui/material';
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineConnector,
  TimelineSeparator,
  TimelineItem,
  LocalizationProvider,
  DatePicker,
} from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  Send as SendIcon,
  Group as GroupIcon,
  DocumentScanner as DocumentScannerIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import { useAuth } from '../../contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, cyan, grey } from '@mui/material/colors';

// Define theme to match Navigation.js style
const theme = createTheme({
  palette: {
    mode: 'light', // Supports dark mode toggling
    background: {
      default: grey[100], // Matches bg-neutral-100 for main content
      paper: '#fff',
    },
    primary: {
      main: green[500], // Matches Navigation's green gradient
      dark: green[600],
    },
    secondary: {
      main: cyan[500], // Matches Navigation's cyan gradient
      dark: cyan[600],
    },
    text: {
      primary: grey[900],
      secondary: grey[600],
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: grey[900],
        },
      },
    },
  },
});
// Theme configuration for consistent styling
const customTheme = {
  palette: {
    primary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
  },
  paper: {
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.06)',
    backgroundColor: '#ffffff',
  },
  card: {
    borderRadius: 2,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.06)',
    backgroundColor: '#ffffff',
  },
  button: {
    borderRadius: 1.5,
    textTransform: 'none',
    fontWeight: 600,
    '&.MuiButton-containedPrimary': {
      background: 'linear-gradient(to right, #06b6d4, #22d3ee)',
      '&:hover': {
        background: 'linear-gradient(to right, #0891b2, #06b6d4)',
      },
    },
    '&.MuiButton-outlinedPrimary': {
      borderColor: '#06b6d4',
      color: '#06b6d4',
      '&:hover': {
        backgroundColor: 'rgba(6, 182, 212, 0.04)',
      },
    },
  },
  input: {
    borderRadius: 1.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },
};

export default function CustomerDashboard() {
  const { state } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [toggleValue, setToggleValue] = useState('left');
  const [sliderValue, setSliderValue] = useState(30);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  return (
    <ThemeProvider theme={theme}>
      <CustomerLayout>
        <Container maxWidth="xl" sx={{ pb: 4, bgcolor: 'background.default' }}>
          {/* ===== SECTION 0: CONTAINER & GRID EXAMPLES ===== */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              🧱 Container & Grid Examples
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Demonstrates responsive layouts using Container and Grid for
              structuring content.
            </Typography>
            <Grid container spacing={3}>
              {/* Full-width container example */}
              <Grid item xs={12}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Full-Width Section
                  </Typography>
                  <Typography variant="body2">
                    This section spans the entire width using xs={12}, ideal for
                    headers or banners.
                  </Typography>
                </Box>
              </Grid>
              {/* Two-column layout */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Two-Column (Left)
                  </Typography>
                  <Typography variant="body2">
                    This column takes half the width on small screens and above,
                    perfect for side-by-side content.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Two-Column (Right)
                  </Typography>
                  <Typography variant="body2">
                    Complements the left column for a balanced two-column
                    layout.
                  </Typography>
                </Box>
              </Grid>
              {/* Three-column layout */}
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Three-Column (1/3)
                  </Typography>
                  <Typography variant="body2">
                    One of three equal columns for compact content display.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Three-Column (2/3)
                  </Typography>
                  <Typography variant="body2">
                    Middle column for balanced layouts.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ bgcolor: grey[200], p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: 'primary.main' }}
                  >
                    Three-Column (3/3)
                  </Typography>
                  <Typography variant="body2">
                    Final column for multi-column layouts.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 1: TYPOGRAPHY & HEADERS ===== */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              🎨 Typography & Headers
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Pre-styled typography variants for consistent text formatting
              across all pages.
            </Typography>
            <Grid container spacing={3}>
              {/* Headings */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  Headings
                </Typography>
                <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  H1 Heading
                </Typography>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  H2 Heading
                </Typography>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 500 }}>
                  H3 Heading
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                  H4 Heading
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
                  H5 Heading
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  H6 Heading
                </Typography>
              </Grid>
              {/* Body Text */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  Body Text
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Body 1: Ideal for primary content, paragraphs, or detailed
                  descriptions.
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Body 2: Suitable for secondary text, such as notes or minor
                  details.
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Caption: Used for annotations, footnotes, or small
                  disclaimers.
                </Typography>
                <Typography variant="overline" display="block" gutterBottom>
                  Overline: For labels or text above sections.
                </Typography>
              </Grid>
              {/* Subtitles */}
              <Grid item xs={12} sm={12} md={4}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  Subtitles
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Subtitle 1: For section introductions or prominent
                  subheadings.
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Subtitle 2: For smaller subheadings or less prominent titles.
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 2: BUTTONS & ACTIONS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🔘 Buttons & Actions
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Pre-styled buttons and action components for consistent user interactions.
            </Typography>
            <Grid container spacing={4}>
              {/* Basic Buttons */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Basic Buttons
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" color="primary">
                    Primary Button
                  </Button>
                  <Button variant="outlined" color="secondary" sx={{ color: 'secondary.main' }}>
                    Secondary Button
                  </Button>
                  <Button variant="text" color="primary" sx={{ color: 'primary.main' }}>
                    Text Button
                  </Button>
                  <Button variant="contained" color="primary" disabled>
                    Disabled Button
                  </Button>
                </Box>
              </Grid>
              {/* Button Sizes & Icons */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Button Sizes & Icons
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddIcon />}
                  >
                    Large with Icon
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    endIcon={<SaveIcon />}
                  >
                    Medium with Icon
                  </Button>
                  <Button variant="contained" color="primary" size="small">
                    Small Button
                  </Button>
                </Box>
              </Grid>
              {/* Icon Buttons & FAB */}
              <Grid item xs={12} sm={12} md={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Icon Buttons & FAB
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Search">
                      <IconButton sx={{ color: 'success.main' }}>
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <ToggleButtonGroup
                    value={toggleValue}
                    exclusive
                    onChange={(e, val) => val && setToggleValue(val)}
                    color="primary"
                  >
                    <ToggleButton value="left">Left</ToggleButton>
                    <ToggleButton value="center">Center</ToggleButton>
                    <ToggleButton value="right">Right</ToggleButton>
                  </ToggleButtonGroup>
                  <Fab color="primary" size="medium">
                    <AddIcon />
                  </Fab>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 3: FORM INPUTS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📝 Form Inputs
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Pre-styled form input components for consistent user data entry across pages.
            </Typography>
            <Grid container spacing={4}>
              {/* Text Fields */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Text Fields
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Standard Input"
                    variant="outlined"
                    fullWidth
                    color="primary"
                  />
                  <TextField
                    label="Required Field"
                    variant="outlined"
                    required
                    fullWidth
                    color="primary"
                  />
                  <TextField
                    label="With Helper Text"
                    variant="outlined"
                    helperText="Enter your information here"
                    fullWidth
                    color="primary"
                  />
                  <TextField
                    label="Error State"
                    variant="outlined"
                    error
                    helperText="This field is required"
                    fullWidth
                    color="error"
                  />
                  <TextField
                    label="Multiline"
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    color="primary"
                  />
                </Box>
              </Grid>
              {/* Selects & Controls */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Selects & Controls
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <FormControl fullWidth>
                    <InputLabel id="select-option-label">Select Option</InputLabel>
                    <Select
                      labelId="select-option-label"
                      label="Select Option"
                      color="primary"
                    >
                      <MenuItem value="option1">Option 1</MenuItem>
                      <MenuItem value="option2">Option 2</MenuItem>
                      <MenuItem value="option3">Option 3</MenuItem>
                    </Select>
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          color: 'primary',
                        },
                      }}
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    options={['Option 1', 'Option 2', 'Option 3']}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Autocomplete"
                        color="primary"
                        fullWidth
                      />
                    )}
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked color="primary" />}
                    label="Checkbox Option"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Switch Option"
                  />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
                      Radio Group
                    </Typography>
                    <RadioGroup row defaultValue="yes">
                      <FormControlLabel
                        value="yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
                      Slider
                    </Typography>
                    <Slider
                      value={sliderValue}
                      onChange={(e, val) => setSliderValue(val)}
                      valueLabelDisplay="auto"
                      color="primary"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 4: CARDS & CONTENT ===== */}
          <Paper sx={{ ...customTheme.paper, p: 3, mb: 3 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 700, color: customTheme.palette.text.primary }}
            >
              🃏 Cards & Content
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={customTheme.card}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: customTheme.palette.primary.main }}
                      >
                        A
                      </Avatar>
                    }
                    action={
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title="Card with Header"
                    subheader="September 14, 2023"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      This is a card with header, content, and actions. Perfect
                      for displaying structured information.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<FavoriteIcon />}>
                      Like
                    </Button>
                    <Button size="small" startIcon={<ShareIcon />}>
                      Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={customTheme.card}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Simple Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is a simple card layout without header or actions.
                      Good for basic content display.
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip label="Tag 1" color="primary" size="small" />
                      <Chip label="Tag 2" color="secondary" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={customTheme.card}>
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      Card with Badges
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Badge badgeContent={4} color="primary">
                        <NotificationsIcon />
                      </Badge>
                      <Badge badgeContent={99} color="secondary">
                        <NotificationsIcon />
                      </Badge>
                    </Box>
                    <Rating value={4} readOnly />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Cards can contain various interactive elements.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 5: NAVIGATION & TABS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🧭 Navigation & Tabs
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Navigation components for intuitive page navigation and content organization.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Tabs
                </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={(e, val) => setTabValue(val)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="Tab One" />
                    <Tab label="Tab Two" />
                    <Tab label="Tab Three" />
                  </Tabs>
                </Box>
                <Box sx={{ p: 3 }}>
                  {tabValue === 0 && (
                    <Typography variant="body1">Content for Tab One</Typography>
                  )}
                  {tabValue === 1 && (
                    <Typography variant="body1">Content for Tab Two</Typography>
                  )}
                  {tabValue === 2 && (
                    <Typography variant="body1">Content for Tab Three</Typography>
                  )}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 3, mb: 2 }}>
                  Breadcrumbs
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  <Link underline="hover" color="inherit" href="/">
                    Home
                  </Link>
                  <Link underline="hover" color="inherit" href="/customer">
                    Customer
                  </Link>
                  <Typography color="primary.main">Dashboard</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Menu & Accordion
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  sx={{ mb: 2 }}
                >
                  Open Menu
                </Button>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                >
                  <MenuItem onClick={() => setMenuAnchor(null)}>Profile</MenuItem>
                  <MenuItem onClick={() => setMenuAnchor(null)}>Settings</MenuItem>
                  <MenuItem onClick={() => setMenuAnchor(null)}>Logout</MenuItem>
                </Menu>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                      <Typography variant="subtitle1">Accordion Section 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Content for the first accordion section.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                      <Typography variant="subtitle1">Accordion Section 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Content for the second accordion section.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 6: DATA DISPLAY ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📊 Data Display
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Components for displaying tabular and list-based data efficiently.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Table
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>ID</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>Name</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>Balance</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { id: 1, name: 'Account 1', balance: '$5,000', status: 'Active' },
                        { id: 2, name: 'Account 2', balance: '$3,200', status: 'Active' },
                        { id: 3, name: 'Account 3', balance: '$1,800', status: 'Inactive' },
                        { id: 4, name: 'Account 4', balance: '$7,500', status: 'Active' },
                        { id: 5, name: 'Account 5', balance: '$1,100', status: 'Inactive' },
                      ]
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.balance}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                color={row.status === 'Active' ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Edit">
                                <IconButton size="small" color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="secondary">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={5}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                  />
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  List
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <List>
                    {[
                      { primary: 'Recent Transaction 1', secondary: 'Transfer to John Doe - $500' },
                      { primary: 'Recent Transaction 2', secondary: 'Payment to Electric Company - $120' },
                      { primary: 'Recent Transaction 3', secondary: 'Deposit from Salary - $3000' },
                      { primary: 'Recent Transaction 4', secondary: 'Online Purchase - $75' },
                      { primary: 'Recent Transaction 5', secondary: 'ATM Withdrawal - $200' },
                    ].map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItemButton>
                          <ListItemIcon>
                            <HomeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.primary}
                            secondary={item.secondary}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                        {index < 4 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 7: FEEDBACK & LOADING ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              💬 Feedback & Loading
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Components for user feedback and loading states to enhance user experience.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Alerts & Snackbar
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="success">Success alert message</Alert>
                  <Alert severity="info">Info alert message</Alert>
                  <Alert severity="warning">Warning alert message</Alert>
                  <Alert severity="error">Error alert message</Alert>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setSnackbarOpen(true)}
                  >
                    Show Snackbar
                  </Button>
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
                      Action completed successfully!
                    </Alert>
                  </Snackbar>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Progress & Loading
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
                      Linear Progress
                    </Typography>
                    <LinearProgress variant="determinate" value={65} color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Circular Progress
                    </Typography>
                    <CircularProgress size={30} color="primary" />
                    <CircularProgress
                      variant="determinate"
                      value={75}
                      size={30}
                      color="secondary"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
                      Skeleton Loading
                    </Typography>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" width="100%" height={60} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 8: ADVANCED COMPONENTS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🚀 Advanced Components
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Advanced components for interactive and dynamic user interfaces.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Stepper
                </Typography>
                <Stepper activeStep={1} alternativeLabel>
                  <Step>
                    <StepLabel>Step 1</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Step 2</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Step 3</StepLabel>
                  </Step>
                </Stepper>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mt: 3, mb: 2 }}>
                  Timeline
                </Typography>
                <Timeline position="alternate">
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle1">Event 1</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description of event 1
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="secondary" />
                      <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle1">Event 2</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description of event 2
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Dialog & Speed Dial
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Open Dialog
                </Button>
                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Sample Dialog</DialogTitle>
                  <DialogContent>
                    <Typography variant="body1">
                      This is a sample dialog for user interactions.
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)} color="primary" variant="contained">
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
                <Box
                  sx={{
                    position: 'relative',
                    height: 200,
                    border: '1px dashed',
                    borderColor: 'grey.400',
                    p: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Speed Dial (floats in context)
                  </Typography>
                  <SpeedDial
                    ariaLabel="SpeedDial example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                  >
                    <SpeedDialAction icon={<SaveIcon />} tooltipTitle="Save" />
                    <SpeedDialAction icon={<EditIcon />} tooltipTitle="Edit" />
                    <SpeedDialAction icon={<DeleteIcon />} tooltipTitle="Delete" />
                  </SpeedDial>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 9: CHARTS & VISUALIZATIONS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📈 Charts & Visualizations
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Chart components for visualizing data trends and distributions. Requires @mui/x-charts.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Bar Chart
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <BarChart
                    series={[
                      {
                        data: [150, 200, 180, 250, 220],
                        label: 'Sales',
                        color: theme.palette.primary.main,
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        label: 'Month',
                      },
                    ]}
                    margin={{ top: 30, bottom: 40, left: 50, right: 10 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Pie Chart
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: 10, label: 'Category A', color: theme.palette.primary.main },
                          { id: 1, value: 15, label: 'Category B', color: theme.palette.secondary.main },
                          { id: 2, value: 20, label: 'Category C', color: theme.palette.grey[400] },
                        ],
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      },
                    ]}
                    height={200}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Line Chart
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <LineChart
                    xAxis={[
                      {
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        scaleType: 'point',
                        label: 'Day',
                      },
                    ]}
                    series={[
                      {
                        data: [100, 120, 150, 130, 160],
                        label: 'Value',
                        color: theme.palette.secondary.main,
                      },
                    ]}
                    margin={{ top: 30, bottom: 40, left: 50, right: 10 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 10: COMPLEX LAYOUT PATTERNS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🧩 Complex Layout Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Layout patterns using cards for summarizing and displaying key information.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total Balance
                      </Typography>
                      <Tooltip title="View Details">
                        <IconButton color="primary" size="small">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography
                      variant="h3"
                      color="primary.main"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      $12,345.67
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      As of today's closing.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title="Recent Activity"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent>
                    <List dense>
                      {[
                        { primary: 'Sent $250 to Jane Doe', secondary: 'Yesterday at 3:00 PM', icon: <SendIcon /> },
                        { primary: 'Received $1500 from Employer', secondary: '2 days ago', icon: <HomeIcon /> },
                        { primary: 'Paid electricity bill', secondary: '3 days ago', icon: <DocumentScannerIcon /> },
                      ].map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemIcon>{item.icon}</ListItemIcon>
                              <ListItemText
                                primary={item.primary}
                                secondary={item.secondary}
                                primaryTypographyProps={{ variant: 'subtitle2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItemButton>
                          </ListItem>
                          {index < 2 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" color="primary">
                      View All
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Account Overview"
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Checking Balance
                        </Typography>
                        <Typography variant="h5" color="primary.main">
                          $8,500.00
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Savings Balance
                        </Typography>
                        <Typography variant="h5" color="secondary.main">
                          $3,845.67
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Credit Limit
                        </Typography>
                        <Typography variant="h5">$10,000.00</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Available Credit
                        </Typography>
                        <Typography variant="h5">$7,200.00</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 11: USER PROFILE & SETTINGS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              👤 User Profile & Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Components for displaying and managing user profile and security settings.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Profile Details
                </Typography>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          width: 60,
                          height: 60,
                          mr: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          John Doe
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          john.doe@example.com
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textTransform: 'capitalize' }}
                        >
                          Role: {state.user?.role || 'Customer'}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Contact Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Phone: +1 234 567 8900
                    </Typography>
                    <Typography variant="body2">
                      Address: 123 Main St, Anytown, USA
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} color="primary">
                      Edit Profile
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Security Settings
                </Typography>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <List dense>
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <LockIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Change Password"
                          secondary="Update your account password"
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Tooltip title="Change Password">
                          <IconButton edge="end" aria-label="change password" color="primary">
                            <KeyIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <Switch defaultChecked color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Two-Factor Authentication"
                          secondary="Add an extra layer of security"
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemIcon>
                          <NotificationsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive alerts and updates"
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Dialog Component */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: customTheme.paper }} // Apply paper styling to dialog
          >
            <DialogTitle
              sx={{ fontWeight: 700, color: customTheme.palette.text.primary }}
            >
              Sample Dialog
            </DialogTitle>
            <DialogContent dividers>
              <Typography>
                This is a sample dialog. You can put any content here including
                forms, tables, or other components.
              </Typography>
              <TextField
                label="Dialog Input"
                variant="outlined"
                fullWidth
                sx={{ mt: 2, ...customTheme.input }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={customTheme.button}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="contained"
                sx={customTheme.button}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar Component */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              This is a success snackbar message!
            </Alert>
          </Snackbar>

          {/* ===== SECTION 12: NOTIFICATIONS & TIMELINE ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🔔 Notifications & Timeline
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Components for displaying user notifications and activity timelines.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Notifications List
                </Typography>
                <List dense>
                  {[
                    {
                      primary: 'Your statement is ready',
                      secondary: '2 hours ago',
                      icon: <NotificationsIcon color="primary" />,
                    },
                    {
                      primary: 'New login from Chrome',
                      secondary: 'Yesterday',
                      icon: <NotificationsIcon color="secondary" />,
                    },
                    {
                      primary: 'Payment received',
                      secondary: '3 days ago',
                      icon: <NotificationsIcon sx={{ color: 'success.main' }} />,
                    },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={item.primary}
                          secondary={item.secondary}
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {index < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Activity Timeline
                </Typography>
                <Timeline position="alternate">
                  {[
                    {
                      title: 'Logged in',
                      time: 'Today, 09:00 AM',
                      color: 'primary',
                    },
                    {
                      title: 'Transferred $200',
                      time: 'Yesterday, 04:30 PM',
                      color: 'secondary',
                    },
                    {
                      title: 'Changed password',
                      time: '2 days ago',
                      color: 'success',
                    },
                  ].map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color={item.color} />
                        {index < 2 && <TimelineConnector sx={{ bgcolor: `${item.color}.main` }} />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.time}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 13: FAQ & SUPPORT ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              ❓ FAQ & Support
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Accordion-based FAQ section for common user queries and support information.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                {
                  question: 'How do I reset my password?',
                  answer: 'Go to your profile settings and click "Change Password". Follow the instructions to reset your password.',
                },
                {
                  question: 'How can I contact support?',
                  answer: (
                    <>
                      You can contact our support team via email at{' '}
                      <Link href="mailto:support@bank.com" color="primary.main">
                        support@bank.com
                      </Link>{' '}
                      or call 1800-123-456.
                    </>
                  ),
                },
                {
                  question: 'Where can I find my transaction history?',
                  answer: 'Navigate to the "Recent Activity" or "Transaction History" section in your dashboard.',
                },
              ].map((item, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                    <Typography variant="subtitle1">{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          {/* ===== SECTION 14: QUICK ACTIONS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              ⚡ Quick Actions
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Shortcut buttons for common user actions to enhance accessibility.
            </Typography>
            <Grid container spacing={3}>
              {[
                { label: 'Transfer Money', icon: <SendIcon />, color: 'primary' },
                { label: 'View Statement', icon: <DocumentScannerIcon />, color: 'secondary' },
                { label: 'Add Beneficiary', icon: <GroupIcon />, color: 'success' },
                { label: 'Transaction History', icon: <HistoryIcon />, color: 'info' },
              ].map((action, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Button
                    variant="contained"
                    color={action.color}
                    fullWidth
                    startIcon={action.icon}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* ===== SECTION 15: PROMOTIONS & ANNOUNCEMENTS ===== */}
          <Paper sx={{ p: 4, mb: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🎉 Promotions & Announcements
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Highlighted promotions and feature announcements for users.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderLeft: `6px solid ${theme.palette.primary.main}` }}>
                  <CardContent>
                    <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                      Get 5% Cashback!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use your debit card for online shopping and get 5% cashback on all purchases this month.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderLeft: `6px solid ${theme.palette.secondary.main}` }}>
                  <CardContent>
                    <Typography variant="h6" color="secondary.main" gutterBottom sx={{ fontWeight: 600 }}>
                      New Feature: Instant Transfers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enjoy instant money transfers to any bank, anytime, anywhere. Try it now!
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 16: ADVANCED FORM EXAMPLE ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📝 Advanced Form Example
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              A sample form demonstrating advanced input fields and validation.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                maxWidth: 500,
              }}
              autoComplete="off"
            >
              <TextField
                label="Full Name"
                variant="outlined"
                required
                fullWidth
                color="primary"
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                required
                fullWidth
                color="primary"
              />
              <FormControl fullWidth>
                <InputLabel id="account-type-label">Account Type</InputLabel>
                <Select
                  labelId="account-type-label"
                  label="Account Type"
                  color="primary"
                >
                  <MenuItem value="checking">Checking</MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Agree to Terms"
              />
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Paper>

          {/* ===== SECTION 17: BASIC TABLE ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📋 Basic Table
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              A simple table for displaying user data with status indicators.
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>ID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Email</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3].map((id) => (
                    <TableRow key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>User {id}</TableCell>
                      <TableCell>user{id}@mail.com</TableCell>
                      <TableCell>
                        <Chip
                          label={id % 2 === 0 ? 'Active' : 'Inactive'}
                          color={id % 2 === 0 ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* ===== SECTION 18: DENSE TABLE WITH CRUD ACTIONS ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              🛠️ Table with CRUD Actions
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              A dense table with actions for managing beneficiaries.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>ID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Beneficiary</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Account</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { id: 1, name: 'Jane Doe', acc: '123-456' },
                    { id: 2, name: 'John Smith', acc: '789-012' },
                  ].map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.acc}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Beneficiary
              </Button>
            </Box>
          </Paper>

          {/* ===== SECTION 19: LISTS (SIMPLE & AVATAR) ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📑 Lists (Simple & With Avatar)
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Simple and avatar-based lists for navigation or user display.
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Simple List
                </Typography>
                <List dense>
                  {[
                    { primary: 'Dashboard', icon: <HomeIcon color="primary" /> },
                    { primary: 'Profile', icon: <PersonIcon color="primary" /> },
                    { primary: 'Settings', icon: <SettingsIcon color="primary" /> },
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.primary}
                        primaryTypographyProps={{ variant: 'subtitle2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  List with Avatar
                </Typography>
                <List dense>
                  {[
                    { name: 'Alice', mail: 'alice@mail.com' },
                    { name: 'Bob', mail: 'bob@mail.com' },
                  ].map((user, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={user.mail}
                        primaryTypographyProps={{ variant: 'subtitle2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== SECTION 20: PAGINATED TABLE ===== */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              📄 Paginated Table
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              A paginated table for displaying large datasets efficiently.
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>ID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Role</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(15)].map((_, i) => ({
                    id: i + 1,
                    name: `User ${i + 1}`,
                    role: i % 2 === 0 ? 'Customer' : 'Employee',
                  }))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.role}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={15}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              />
            </TableContainer>
          </Paper>
        </Container>
      </CustomerLayout>
    </ThemeProvider>
  );
}
