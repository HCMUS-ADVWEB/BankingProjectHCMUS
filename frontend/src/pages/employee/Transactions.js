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
import { TRANSACTION_TYPES } from '../../utils/constants';

// Sample data for sections
const timelineData = [
  { id: 1, time: '2025-06-14', event: 'Transaction #001 completed' },
  { id: 2, time: '2025-06-13', event: 'Account verified' },
];
export default function TransactionsPage() {
  const { state } = useAuth();
  const {
    transactionAccountHistory,
    setTransactionAccountHistory,
    transactions,
  } = useEmployee();
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
  const filteredTableData = transactions
    .filter((row) => {
      const fullName =
        row.category === 'RECEIPT' ? row.remitter?.fullName :
          row.category === 'TRANSFER' ? row.recipient?.fullName :
            row.category === 'DEBT_PAYMENT' ? row.debtor?.fullName : '';
      return fullName.toLowerCase().includes(filterName.toLowerCase());
    })
    .sort((a, b) => {
      const nameA =
        a.category === 'RECEIPT' ? a.remitter?.fullName :
          a.category === 'TRANSFER' ? a.recipient?.fullName :
            a.category === 'DEBT_PAYMENT' ? a.debtor?.fullName : '';
      const nameB =
        b.category === 'RECEIPT' ? b.remitter?.fullName :
          b.category === 'TRANSFER' ? b.recipient?.fullName :
            b.category === 'DEBT_PAYMENT' ? b.debtor?.fullName : '';
      return nameA.localeCompare(nameB);
    });
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
  // Filter transactions by type
  const filteredTransactions = transactionAccountHistory.type === 'ALL'
    ? transactions
    : transactions.filter(tx => tx.category === transactionAccountHistory.type);
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
            📝 Get transaction history
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                label="Account id"
                variant="outlined"
                fullWidth
                value={transactionAccountHistory.accountId || ''}
                onChange={e => setTransactionAccountHistory(prev => ({ ...prev, accountId: e.target.value }))}
              />
            </Grid>
            <Button
              onClick={handleDialogClose}
              color="primary"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <ToggleButtonGroup
              value={transactionAccountHistory.type}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setTransactionAccountHistory(prev => ({ ...prev, type: newValue }));
              }}
              color="primary"
            >

              {TRANSACTION_TYPES.map(type => (
                <ToggleButton key={type.value} value={type.value}>{type.label}</ToggleButton>
              ))}
            </ToggleButtonGroup>
            <TableContainer
              component={Paper}
              sx={{ mt: 2, borderRadius: 'shape.borderRadius' }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Remitter</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payer</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.ordinalNumber}>
                        <TableCell>{row.ordinalNumber}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>
                          {row.category === 'RECEIPT' && row.remitter?.fullName}
                          {row.category === 'TRANSFER' && row.recipient?.fullName}
                          {row.category === 'DEBT_PAYMENT' && row.debtor?.fullName}
                        </TableCell>
                        <TableCell>{row.transactionAmount}</TableCell>
                        <TableCell>{row.transactionPayer}</TableCell>
                        <TableCell>{row.transactionNote}</TableCell>
                        <TableCell>{row.transactionTime}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

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
            📋 Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display transaction data in a tabular format.
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: 'shape.borderRadius' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ordinal</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.ordinalNumber}>
                    <TableCell>{tx.ordinalNumber}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell>{tx.transactionAmount}</TableCell>
                    <TableCell>{tx.transactionNote}</TableCell>
                    <TableCell>{tx.transactionTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </EmployeeLayout >
  );
}
