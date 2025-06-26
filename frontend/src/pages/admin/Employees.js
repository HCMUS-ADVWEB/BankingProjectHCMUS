import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Backdrop,
  InputAdornment,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import {
  Info,
  Delete,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRef } from 'react';


export default function EmployeesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dob: null,
    role: 'EMPLOYEE',
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const rowsPerPage = 5;

  const usernameRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const dobRef = useRef();

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users');
      const { data, message, timestamp } = response.data;
      setEmployees(data.filter(emp => emp.role !== 'CUSTOMER'));
    } catch (error) {
      setTimeout(fetchEmployees, 1000); // retry sau 1s
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message;
        const timestamp =
          error.response.data?.timestamp || new Date().toISOString();
        console.error(`Error ${status}: ${msg} at ${timestamp}`);

        if (status === 400) {
          alert(`Bad request: ${msg}`);
        } else if (status === 500) {
          alert('Internal server error');
        } else if (status === 401) {
          // logout
          alert('Unauthorized: Please log in again.');
          window.location.href = '/auth/login';
        }
      } else if (error.request) {
        console.error('Network error or no response from server.');
      } else {
        console.error('Unexpected error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      setIsLoading(true);

      const payload = {
        ...newEmployee,
        dob: newEmployee.dob ? new Date(newEmployee.dob).toISOString() : null,
      };

      await api.post('/api/users', payload);

      setNewEmployee({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dob: null,
        role: 'EMPLOYEE',
        isActive: true,
      });
      fetchEmployees();
    } catch (error) {
      console.error('Failed to add employee', error);
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message;
        const timestamp =
          error.response.data?.timestamp || new Date().toISOString();
        console.error(`Error ${status}: ${msg} at ${timestamp}`);

        if (status === 400) {
          alert(`${msg}`);
        } else if (status === 500) {
          alert('Internal server error');
        } else if (status === 401) {
          // logout
          alert('Unauthorized: Please log in again.');
          window.location.href = '/auth/login';
        }
      } else if (error.request) {
        console.error('Network error or no response from server.');
      } else {
        console.error('Unexpected error:', error.message);
      }
    } finally {
      setIsLoading(false);
      setOpenAddDialog(false);
    }
  };

  const isFormValid = () => {
    const {
      username, password, fullName, email, phone, address, dob,
    } = newEmployee;
    return (
      username.trim() &&
      password.trim() &&
      fullName.trim() &&
      email.trim() &&
      phone.trim() &&
      address.trim() &&
      dob
    );
  };

  const handleSubmit = () => {
    if (!newEmployee.username.trim()) {
      usernameRef.current.focus();
    } else if (!newEmployee.password.trim()) {
      passwordRef.current.focus();
    } else if (!newEmployee.fullName.trim()) {
      fullNameRef.current.focus();
    } else if (!newEmployee.email.trim()) {
      emailRef.current.focus();
    } else if (!newEmployee.phone.trim()) {
      phoneRef.current.focus();
    } else if (!newEmployee.address.trim()) {
      addressRef.current.focus();
    } else if (!newEmployee.dob) {
      dobRef.current.focus();
    }
    else {
      handleAddEmployee();
      setOpenAddDialog(false);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    console.log('Move to employee:', id);
    navigate(`/admin/employees/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setEmployeeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/api/users/${employeeToDelete}`);
      setOpenDeleteDialog(false);
      setEmployeeToDelete(null);
      fetchEmployees(); // reload danh sách
    } catch (error) {
      console.error('Failed to delete employee', error);
      if (error.response) {
        const status = error.response.status;
        const msg = error.response.data?.message;
        const timestamp =
          error.response.data?.timestamp || new Date().toISOString();
        console.error(`Error ${status}: ${msg} at ${timestamp}`);

        if (status === 400) {
          alert(`${msg}`);
        } else if (status === 500) {
          alert('Internal server error');
        } else if (status === 401) {
          // logout
          alert('Unauthorized: Please log in again.');
          window.location.href = '/auth/login';
        }
      } else if (error.request) {
        console.error('Network error or no response from server.');
      } else {
        console.error('Unexpected error:', error.message);
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Backdrop
        open={isLoading}
        sx={{
          color: '#90caf9',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(0,0,0,0.7)',
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Employee List
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
          >
            Add Employee
          </Button>
        </Box>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            <TextField
              inputRef={usernameRef}
              margin="dense"
              label="Username"
              name="username"
              value={newEmployee.username}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              inputRef={passwordRef}
              margin="dense"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={newEmployee.password}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              inputRef={fullNameRef}
              margin="dense"
              label="Full Name"
              name="fullName"
              required
              value={newEmployee.fullName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              inputRef={emailRef}
              margin="dense"
              label="Email"
              name="email"
              required
              value={newEmployee.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              inputRef={phoneRef}
              margin="dense"
              label="Phone"
              name="phone"
              required
              value={newEmployee.phone}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              inputRef={addressRef}
              margin="dense"
              label="Address"
              name="address"
              required
              value={newEmployee.address}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                format="dd-MM-yyyy"
                value={newEmployee.dob}
                required
                onChange={(newValue) =>
                  setNewEmployee({ ...newEmployee, dob: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    inputRef={dobRef}
                    {...params}
                    margin="dense"
                    fullWidth
                    variant="outlined" />
                )}
                sx={{ my: 1 }}
              />
            </LocalizationProvider>
            <Select
              fullWidth
              label="Role"
              name="role"
              required
              variant="outlined"
              value={newEmployee.role ? newEmployee.role : 'EMPLOYEE'}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, role: e.target.value })
              }
              margin="dense"
              sx={{ my: 1 }}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
            </Select>

            <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
              <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>Active:</Typography>
              <Checkbox
                checked={newEmployee.isActive}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, isActive: e.target.checked })
                }
              />
            </Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
            >
              Add
            </Button>

          </DialogActions>
        </Dialog>



        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete employee <strong>{employeeToDelete}</strong>?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmDelete()}
              sx={{ color: '#f44336' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>


        <TableContainer component={Paper} sx={{ bgcolor: '#1e1e1e' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((emp) => (
                  <TableRow
                    key={emp.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/employees/${emp.id}`, { state: { employee: emp } })}
                  >
                    <TableCell>{emp.username}</TableCell>
                    <TableCell>{emp.fullName}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(e, emp.id)}
                      >
                        <Info sx={{ color: '#90caf9' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteClick(e, emp.id)}
                      >
                        <Delete sx={{ color: '#f44336' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={employees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            sx={{
              color: '#fff',
              '.MuiTablePagination-toolbar': { bgcolor: '#1e1e1e' },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                color: '#fff',
              },
              '.MuiSvgIcon-root': { color: '#90caf9' },
            }}
          />

        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
