import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Fab,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Switch,
  Slider,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Skeleton,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  Breadcrumbs,
  Link,
  Menu,
  Rating,
  Stepper,
  Step,
  StepLabel,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  CardMedia,
} from '@mui/material';
import { BarChart, LineChart, PieChart, ScatterChart } from '@mui/x-charts';
import {
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineSeparator,
  TimelineItem,
  Timeline,
} from '@mui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  UploadFile as UploadFileIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Sample data for sections
const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
];
const timelineData = [
  { id: 1, time: '2025-06-14', event: 'Transaction #001 completed' },
  { id: 2, time: '2025-06-13', event: 'Account verified' },
];

export default function Template() {
  const { state } = useAuth();
  // State for interactive components
  const [toggleValue, setToggleValue] = useState('left');
  const [sliderValue, setSliderValue] = useState(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [formData, setFormData] = useState({ name: '', dob: null, file: null });
  const [formErrors, setFormErrors] = useState({ name: false });

  // Handlers for components
  const handleToggleChange = (event, newValue) =>
    newValue && setToggleValue(newValue);
  const handleSliderChange = (event, newValue) => setSliderValue(newValue);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const filteredTableData = tableData
    .filter((row) => row.name.toLowerCase().includes(filterName.toLowerCase()))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFormSubmit = () => {
    if (!formData.name) {
      setFormErrors({ ...formErrors, name: true });
    } else {
      setFormErrors({ ...formErrors, name: false });
      console.log('Form submitted:', formData);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4, bgcolor: 'background.default' }}>
        {/* SECTION 0: Dashboard Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
          >
            Welcome, {state.user?.fullName || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your dashboard provides a quick overview of key metrics and actions.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  1,234
                </Typography>
                <Chip
                  label="+5% this month"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Revenue
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  $56,789
                </Typography>
                <Chip
                  label="+12% this month"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Active Projects
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  42
                </Typography>
                <Badge badgeContent={3} color="error" sx={{ mt: 1 }}>
                  <Chip label="Pending" size="small" />
                </Badge>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  System Status
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All systems operational
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography variant="h5" color="text.primary">
                  Quick Actions
                </Typography>
                <Button variant="outlined" color="primary">
                  View All
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* SECTION 1: Container & Grid Examples */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🧱 Container & Grid
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Create responsive layouts using Container and Grid for content
            arrangement.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Full Width
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This section spans the full width (xs=12), ideal for headers
                  or banners.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Dual Column (Left)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This column occupies half the width on small screens and up.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Dual Column (Right)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complements the left column for a balanced two-column layout.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Triple Column (1/3)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  One of three equal columns.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Triple Column (2/3)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Middle column for a balanced layout.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 'shape.borderRadius',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Triple Column (3/3)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Final column for a multi-column layout.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 2: Typography & Headers */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
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
            Predefined typography styles for consistent text formatting.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Headings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h1">H1</Typography>
                <Typography variant="h2">H2</Typography>
                <Typography variant="h3">H3</Typography>
                <Typography variant="h4">H4</Typography>
                <Typography variant="h5">H5</Typography>
                <Typography variant="h6">H6</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Body Text
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  Body 1: Main content or paragraphs.
                </Typography>
                <Typography variant="body2">
                  Body 2: Notes or secondary details.
                </Typography>
                <Typography variant="caption">
                  Caption: Annotations or footnotes.
                </Typography>
                <Typography variant="overline">
                  Overline: Section labels.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Subtitles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle1">
                  Subtitle 1: Section introductions.
                </Typography>
                <Typography variant="subtitle2">
                  Subtitle 2: Smaller subheadings.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 3: Buttons & Actions */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🔘 Buttons & Actions
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Pre-styled buttons and actions for consistent user interactions.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Basic Buttons
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button variant="contained" color="primary">
                  Primary Button
                </Button>
                <Button variant="outlined" color="secondary">
                  Secondary Button
                </Button>
                <Button variant="text" color="primary">
                  Text Button
                </Button>
                <Button variant="contained" color="primary" disabled>
                  Disabled Button
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Sizes & Icons
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                >
                  Large + Icon
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="medium"
                  endIcon={<SaveIcon />}
                >
                  Medium + Icon
                </Button>
                <Button variant="contained" color="primary" size="small">
                  Small
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Icon Buttons & FAB
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                    <IconButton color="primary">
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ToggleButtonGroup
                  value={toggleValue}
                  exclusive
                  onChange={handleToggleChange}
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

        {/* SECTION 4: Form Inputs */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📝 Form Inputs
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Pre-styled form inputs for consistent data entry.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Text Fields
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Standard Input"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Required Field"
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="With Helper Text"
                  variant="outlined"
                  helperText="Enter information here"
                  fullWidth
                />
                <TextField
                  label="Error State"
                  variant="outlined"
                  error
                  helperText="This field is required"
                  fullWidth
                />
                <TextField
                  label="Multiline"
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Select & Controls
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="select-option-label">
                    Select Option
                  </InputLabel>
                  <Select labelId="select-option-label" label="Select Option">
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  options={['Option 1', 'Option 2', 'Option 3']}
                  renderInput={(params) => (
                    <TextField {...params} label="Autocomplete" fullWidth />
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
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    gutterBottom
                  >
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
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    gutterBottom
                  >
                    Slider
                  </Typography>
                  <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 5: Dialog & Snackbar */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🔔 Dialog & Snackbar
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display notifications or interactive modals for user engagement.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Dialog
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
              >
                Open Dialog
              </Button>
              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogContent>
                  <Typography variant="body1" color="text.secondary">
                    This is sample content for the dialog. You can add forms or
                    other content.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDialogClose}>Cancel</Button>
                  <Button
                    onClick={handleDialogClose}
                    color="primary"
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Snackbar
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSnackbarOpen}
              >
                Open Snackbar
              </Button>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Action successful!
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 6: Table */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📊 Table
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display data in a tabular format with pagination.
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: 'shape.borderRadius' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* SECTION 7: Timeline & Chart */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📈 Timeline & Chart
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display temporal data or visualizations.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Timeline
              </Typography>
              <Timeline>
                {timelineData.map((item) => (
                  <TimelineItem key={item.id}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="text.primary">
                        {item.time}
                      </Typography>
                      <Typography variant="body1">{item.event}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Bar Chart
              </Typography>
              <BarChart
                series={[{ data: [10, 20, 30, 40] }]}
                height={200}
                xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 8: Cards & Chips */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🃏 Cards & Chips
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Use Cards for prominent content and Chips for labels or statuses.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Cards
              </Typography>
              <Card sx={{ maxWidth: 320, mx: 'auto' }}>
                <CardHeader
                  avatar={
                    <Avatar>{state.user?.fullName?.charAt(0) || 'U'}</Avatar>
                  }
                  title="Card Title"
                  subheader="Subtitle"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Sample content for the card. Can include text, images, or
                    charts.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                  <Button size="small" color="secondary">
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Chips & Badges
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Active" color="primary" />
                  <Chip label="Paused" variant="outlined" color="secondary" />
                  <Chip label="Deleted" color="error" onDelete={() => {}} />
                </Box>
                <Badge badgeContent={3} color="primary">
                  <Button variant="contained" color="primary">
                    Notifications
                  </Button>
                </Badge>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 9: Accordion & Tabs */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📑 Accordion & Tabs
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Use Accordion to collapse/expand content and Tabs for section
            navigation.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Accordion
              </Typography>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Item 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    Detailed content for Item 1. Can include text or other
                    components.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Item 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    Detailed content for Item 2.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Tabs
              </Typography>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 'shape.borderRadius',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Content for Tab {tabValue + 1}.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 10: Progress & Skeleton */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            ⏳ Progress & Skeleton
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display loading states or progress with Progress and Skeleton.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Progress
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <LinearProgress sx={{ mb: 1 }} />
                <LinearProgress
                  variant="determinate"
                  value={50}
                  sx={{ mb: 1 }}
                />
                <CircularProgress />
                <CircularProgress variant="determinate" value={75} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Skeleton
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="rectangular" width="100%" height={60} />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 11: Lists & Navigation */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📋 Lists & Navigation
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Use Lists for itemized content and Breadcrumbs for navigation.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Lists
              </Typography>
              <List
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 'shape.borderRadius',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Home" secondary="Main navigation" />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile"
                    secondary="User information"
                  />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    secondary="System preferences"
                  />
                </ListItemButton>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Breadcrumbs & Menu
              </Typography>
              <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
                <Link href="#" color="text.secondary">
                  Home
                </Link>
                <Link href="#" color="text.secondary">
                  Category
                </Link>
                <Typography color="text.primary">Details</Typography>
              </Breadcrumbs>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                >
                  Open Menu
                </Button>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                >
                  <MenuItem onClick={() => setMenuAnchor(null)}>
                    Option 1
                  </MenuItem>
                  <MenuItem onClick={() => setMenuAnchor(null)}>
                    Option 2
                  </MenuItem>
                  <MenuItem onClick={() => setMenuAnchor(null)}>
                    Option 3
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 12: Rating, Stepper & SpeedDial */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            ⭐ Rating, Stepper & SpeedDial
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Use Rating for evaluations, Stepper for progress, and SpeedDial for
            quick actions.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Rating
              </Typography>
              <Rating
                value={3}
                onChange={(_e, _newValue) => {}}
                sx={{ color: 'primary.main' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Stepper
              </Typography>
              <Stepper activeStep={1}>
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                SpeedDial
              </Typography>
              <SpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'relative' }}
                icon={<SpeedDialIcon />}
              >
                <SpeedDialAction
                  icon={<AddIcon />}
                  tooltipTitle="Add"
                  onClick={() => {}}
                />
                <SpeedDialAction
                  icon={<EditIcon />}
                  tooltipTitle="Edit"
                  onClick={() => {}}
                />
                <SpeedDialAction
                  icon={<DeleteIcon />}
                  tooltipTitle="Delete"
                  onClick={() => {}}
                />
              </SpeedDial>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 13: Advanced Table */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📊 Advanced Table
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display data with filtering, sorting, and pagination capabilities.
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
            <TextField
              label="Filter by Name"
              variant="outlined"
              size="small"
              onChange={(e) => setFilterName(e.target.value)}
            />
            <FormControl size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="role">Role</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 'shape.borderRadius' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="secondary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* SECTION 14: Advanced Form */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📋 Advanced Form
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Complex form with date picker, file upload, and validation.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                error={formErrors.name}
                helperText={formErrors.name && 'Full Name is required'}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                />
              </Button>
              {formData.file && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Selected: {formData.file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    setFormData({ name: '', dob: null, file: null })
                  }
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 17: Complex Layout Patterns */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🏗️ Complex Layout Patterns
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Advanced layouts with nested grids and sidebar navigation.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={3}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 'shape.borderRadius',
                  border: 1,
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Sidebar
                </Typography>
                <List>
                  <ListItemButton>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Analytics" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Reports" />
                  </ListItemButton>
                </List>
              </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 'shape.borderRadius',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Header Section
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Main content header.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 'shape.borderRadius',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Content Block 1
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Primary content area.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 'shape.borderRadius',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      Content Block 2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Secondary content area.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {/* SECTION 18: Advanced Cards */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            🃏 Advanced Cards
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Interactive and image-based cards for rich content display.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ maxWidth: 320, mx: 'auto' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://via.placeholder.com/320x140"
                  alt="Card image"
                />
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    Image Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This card features an image header with descriptive content.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ maxWidth: 320, mx: 'auto' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    Interactive Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hover to reveal actions.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Rating value={4} readOnly />
                  <IconButton color="primary">
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* SECTION 19: Charts & Visualizations */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📉 Charts & Visualizations
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Diverse chart types for comprehensive data visualization.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Pie Chart
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'A' },
                      { id: 1, value: 15, label: 'B' },
                      { id: 2, value: 20, label: 'C' },
                    ],
                  },
                ]}
                height={200}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Line Chart
              </Typography>
              <LineChart
                series={[{ data: [2, 5, 3, 8, 6] }]}
                height={200}
                xAxis={[
                  {
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    scaleType: 'point',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Scatter Chart
              </Typography>
              <ScatterChart
                series={[
                  {
                    label: 'Series A',
                    data: [
                      { x: 1, y: 2, id: '1' },
                      { x: 2, y: 5, id: '2' },
                      { x: 3, y: 3, id: '3' },
                      { x: 4, y: 8, id: '4' },
                    ],
                  },
                ]}
                height={200}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Sparkline
              </Typography>
              <LineChart
                series={[{ data: [1, 3, 2, 5, 4, 6, 3] }]}
                height={100}
                xAxis={[
                  {
                    data: [1, 2, 3, 4, 5, 6, 7],
                    scaleType: 'point',
                    hide: true,
                  },
                ]}
                yAxis={[{ hide: true }]}
                sx={{ '& .MuiChartsAxis-root': { display: 'none' } }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </AdminLayout>
  );
}
