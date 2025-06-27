import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Chip,
  Grid,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function EmployeeDetailCard({
  employee,
  editedEmployee,
  editMode,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onFieldUpdate,
}) {
  const textFields = [
    { label: 'Password', value: 'password' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Full Name', value: 'fullName' },
    { label: 'Address', value: 'address' },
  ];

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 'shape.borderRadius',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ID: {employee.id}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {editMode ? (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={onCancel}
                  sx={{
                    color: 'text.primary',
                    borderColor: 'divider',
                    textTransform: 'none',
                    borderRadius: 'shape.borderRadius',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={onSave}
                  sx={{
                    bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 'shape.borderRadius',
                    '&:hover': {
                      bgcolor: 'linear-gradient(to right, #059669, #0284c7)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  onClick={onEdit}
                  sx={{
                    color: 'white',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      color: 'error.contrastText',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={onDelete}
                  sx={{
                    color: 'white',
                    bgcolor: 'error.main',
                    '&:hover': {
                      color: 'error.contrastText',
                      bgcolor: 'error.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          {textFields.map((field) => (
            <Grid item size={{ xs: 12, md: 6 }} key={field.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  sx={{
                    width: { xs: '100px', sm: '140px' },
                    fontWeight: 600,
                    color: 'text.primary',
                    mr: 2,
                  }}
                  variant="body2"
                >
                  {field.label}:
                </Typography>
                {editMode ? (
                  <TextField
                    value={editedEmployee[field.value] || ''}
                    onChange={(e) => onFieldUpdate(field.value, e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    type={field.value === 'password' ? 'password' : 'text'}
                    sx= {{ mr: 5 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.primary">
                    {field.value === 'password' ? '••••••••' : employee[field.value] || '-'}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}

          <Grid item size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                sx={{
                  width: { xs: '100px', sm: '140px' },
                  fontWeight: 600,
                  color: 'text.primary',
                  mr: 2,
                }}
                variant="body2"
              >
                Date of Birth:
              </Typography>
              {editMode ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    format="dd-MM-yyyy"
                    value={editedEmployee.dob ? new Date(editedEmployee.dob) : null}
                    onChange={(newValue) => onFieldUpdate('dob', newValue)}
                    sx={{ mr: 5  }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <Typography variant="body2" color="text.primary">
                  {employee.dob ? format(new Date(employee.dob), 'dd-MM-yyyy') : '-'}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                sx={{
                  width: { xs: '100px', sm: '140px' },
                  fontWeight: 600,
                  color: 'text.primary',
                  mr: 2,
                }}
                variant="body2"
              >
                Role:
              </Typography>
              {editMode ? (
                <Select
                  value={editedEmployee.role || 'EMPLOYEE'}
                  onChange={(e) => onFieldUpdate('role', e.target.value)}
                  size="small"
                  fullWidth
                  sx= {{ mr: 5 }}
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                  <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                </Select>
              ) : (
                <Chip
                  size="small"
                  label={employee.role}
                  sx={{
                    background: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                sx={{
                  width: { xs: '100px', sm: '140px' },
                  fontWeight: 600,
                  color: 'text.primary',
                  mr: 2,
                }}
                variant="body2"
              >
                Active:
              </Typography>
              {editMode ? (
                <Checkbox
                  checked={editedEmployee.isActive || false}
                  onChange={(e) => onFieldUpdate('isActive', e.target.checked)}
                />
              ) : (
                <Chip
                  size="small"
                  label={employee.isActive ? 'Yes' : 'No'}
                  sx={{
                    background: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Grid>

          { !editMode && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  sx={{
                    width: { xs: '100px', sm: '140px' },
                    fontWeight: 600,
                    color: 'text.primary',
                    mr: 2,
                  }}
                  variant="body2"
                >
                  Created At:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {format(new Date(employee.createdAt), 'dd-MM-yyyy HH:mm:ss')}
                </Typography>
              </Box>
            </Grid>
          )}

          { !editMode && (
            <Grid item size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  sx={{
                    width: { xs: '100px', sm: '140px' },
                    fontWeight: 600,
                    color: 'text.primary',
                    mr: 2,
                  }}
                  variant="body2"
                >
                  Updated At:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {format(new Date(employee.updatedAt), 'dd-MM-yyyy HH:mm:ss')}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
