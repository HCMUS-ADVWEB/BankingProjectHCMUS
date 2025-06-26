import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import {
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
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
    { label: 'Username', value: 'username' },
    { label: 'Full name', value: 'fullName' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'Address', value: 'address' },
  ];

  return (
    <Card sx={{ p: 2, borderRadius: 'shape.borderRadius', bgcolor: 'background.paper', mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">ID: {employee.id}</Typography>
          <Box>
            {editMode ? (
              <>
                <Button size="small" onClick={onCancel}>
                                    Cancel
                </Button>
                <Button
                  size="small"
                  sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
                  onClick={onSave}
                >
                                    Save
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={onEdit}>
                  <Edit sx={{ color: '#90caf9' }} />
                </IconButton>
                <IconButton onClick={onDelete}>
                  <Delete sx={{ color: '#f44336' }} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {textFields.map((field) => (
          <Box key={field.value} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ width: 140, fontWeight: 'bold', color: 'text.primary' }}>
              {field.label}:
            </Typography>
            {editMode ? (
              <input
                value={editedEmployee[field.value] || ''}
                onChange={(e) => onFieldUpdate(field.value, e.target.value)}
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
                value={editedEmployee.dob ? new Date(editedEmployee.dob) : null}
                onChange={(newValue) => onFieldUpdate('dob', newValue)}
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
              value={editedEmployee.role || 'EMPLOYEE'}
              onChange={(e) => onFieldUpdate('role', e.target.value)}
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
              checked={editedEmployee.isActive || false}
              onChange={(e) => onFieldUpdate('isActive', e.target.checked)}
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
  );
}
