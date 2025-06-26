import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { format } from 'date-fns';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [employee, setEmployee] = useState(state?.employee);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });
  const [loading, setLoading] = useState(true);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);


  // nếu chưa có state thì fetch
  useEffect(() => {
    if (!state?.employee) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/users/${id}`);
          setEmployee(response.data.data);
        } catch (error) {
          console.error('Failed to fetch employee', error);
          setEmployee(null); // fallback để tránh loading vĩnh viễn
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, state]);

  if (!employee) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
          <Typography variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                        Employee Not Found
          </Typography>
        </Box>
      </AdminLayout>
    );
  }


  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/api/users/${id}`);
      setOpenDeleteDialog(false);
      navigate('/admin/employees'); // redirect về danh sách sau khi xóa
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
    } finally {
      setEmployeeToDelete(null);
      setLoading(false);
    }
  };


  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedEmployee({ ...employee });
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...editedEmployee,
        dob: editedEmployee.dob ? new Date(editedEmployee.dob).toISOString() : null,
      };

      await api.put(`/api/users/${id}`, payload);

      setEmployee({ ...editedEmployee, updatedAt: new Date().toISOString() });
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update employee', error);
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
      setLoading(false);
    }
  };


  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                        Employee Details
          </Typography>
        </Box>

        <Card sx={{ p: 2, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">ID: {employee.id}</Typography>
              <Box>
                {editMode ? (
                  <>
                    <Button size="small" onClick={handleCancel}>
                                            Cancel
                    </Button>
                    <Button size="small" sx={{ bgcolor: 'primary.main', color: 'text.primary' }} onClick={handleSave}>
                                            Save
                    </Button>
                  </>
                ) : (
                  <>
                    <IconButton onClick={handleEdit}>
                      <Edit sx={{ color: '#90caf9' }} />
                    </IconButton>
                    <IconButton onClick={() => setOpenDeleteDialog(true)}>
                      <Delete sx={{ color: '#f44336' }} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            {[
              { label: 'Username', value: 'username' },
              { label: 'Full name', value: 'fullName' },
              { label: 'Email', value: 'email' },
              { label: 'Phone', value: 'phone' },
              { label: 'Address', value: 'address' },
            ].map((field) => (
              <Box key={field.value} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ width: 140, fontWeight: 'bold', color: 'text.primary' }}>
                  {field.label}:
                </Typography>
                {editMode ? (
                  <input
                    value={editedEmployee[field.value]}
                    onChange={(e) =>
                      setEditedEmployee({ ...editedEmployee, [field.value]: e.target.value })
                    }
                    style={{
                      input: { color: 'text.secondary' },
                      background: '#1e1e1e',
                      borderRadius: 'shape.borderRadius',
                      padding: '4px 8px',
                    }}
                  />
                ) : (
                  <Typography>{employee[field.value]}</Typography>
                )}
              </Box>
            ))}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 140, color: 'text.primary', fontWeight: 'bold' }}>
                                Date of birth:
              </Typography>
              {editMode ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    value={new Date(editedEmployee.dob)}
                    onChange={(newValue) =>
                      setEditedEmployee({ ...editedEmployee, dob: newValue })
                    }
                    format="dd-MM-yyyy"
                    sx={{
                      input: { color: 'text.secondary' },
                      svg: { color: '#90caf9' },
                      borderRadius: 'shape.borderRadius',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <Typography>
                  {format(employee.dob, 'dd-MM-yyyy')}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 140, color: 'text.primary', fontWeight: 'bold' }}>Role:</Typography>
              {editMode ? (
                <Select
                  value={editedEmployee.role}
                  onChange={(e) => setEditedEmployee({ ...editedEmployee, role: e.target.value })}
                  sx={{ color: '#fff' }}
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                  <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                </Select>
              ) : (
                <Typography>{employee.role}</Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 140, color: 'text.primary', fontWeight: 'bold' }}>Active:</Typography>
              {editMode ? (
                <Checkbox
                  checked={editedEmployee.isActive}
                  onChange={(e) =>
                    setEditedEmployee({ ...editedEmployee, isActive: e.target.checked })
                  }
                />
              ) : (
                <Typography>{employee.isActive ? 'Yes' : 'No'}</Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 140, color: 'text.primary', fontWeight: 'bold' }}>
                                Created at:
              </Typography>
              <Typography>
                {format(employee.createdAt, 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 140, color: 'text.primary', fontWeight: 'bold' }}>
                                Updated at:
              </Typography>
              <Typography>
                {format(employee.updatedAt, 'dd-MM-yyyy HH:mm:ss')}
              </Typography>
            </Box>
          </CardContent>


        </Card>


        <Button
          variant="outlined"
          onClick={() => navigate('/admin/employees')}
        >
                    Back to Employee List
        </Button>

        {/* Delete Confirmation Dialog */}
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
      </Box>
    </AdminLayout>
  );
}
