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
import { useEmployee } from '../../contexts/EmployeeContext';

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

export default function AccountsPage() {
  const { state } = useAuth();
  const { createAccount, setCreateAccount } = useEmployee();
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
      <Container maxWidth="false" sx={{ py: 4, bgcolor: 'background.default' }}>
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
            📝 Create new user account
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
                <Typography
                  variant="h5"
                  color="primary.main"
                  fontWeight={600}
                  gutterBottom
                >
                  User Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Full Name" variant="outlined" fullWidth required
                      value={createAccount.fullName || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Email" type="email" variant="outlined" fullWidth required
                      value={createAccount.email || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Phone" variant="outlined" fullWidth required
                      value={createAccount.phone || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Address" variant="outlined" fullWidth required
                      value={createAccount.address || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Date of Birth" type="date" variant="outlined" fullWidth required InputLabelProps={{ shrink: true }}
                      value={createAccount.dob || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, dob: e.target.value }))}
                    />
                  </Grid>
                </Grid>
                <Typography
                  sx={{ mt: 4 }}
                  variant="h5"
                  color="primary.main"
                  fontWeight={600}
                  gutterBottom
                >
                  User credentials
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField label="Username" variant="outlined" fullWidth required
                      value={createAccount.username || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField label="Password" type="password" variant="outlined" fullWidth required
                      value={createAccount.password || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField label="Confirm password" type="password" variant="outlined" fullWidth required
                      value={createAccount.passwordConfirmation || ''}
                      onChange={e => setCreateAccount(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <DialogActions>
                  <Button onClick={handleFormSubmit}>Cancel</Button>
                  <Button
                    onClick={handleFormSubmit}
                    color="primary"
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Box>
            </Grid>
          </Grid>

        </Paper>
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
            📋 Accounts
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
      </Container>
    </EmployeeLayout >
  );
}
