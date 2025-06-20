import { useState } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
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

export default function EmployeeDashboard() {
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
    <EmployeeLayout>
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
    </EmployeeLayout>
  );
}
