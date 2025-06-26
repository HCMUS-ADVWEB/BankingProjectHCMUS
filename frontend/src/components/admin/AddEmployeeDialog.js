import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Checkbox,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRef } from 'react';

export default function AddEmployeeDialog({
  open,
  onClose,
  onSubmit,
  newEmployee,
  onFieldChange,
  onEmployeeUpdate,
  formErrors,
  showPassword,
  onTogglePasswordVisibility,
}) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const dobRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
          error={Boolean(formErrors.username)}
          helperText={formErrors.username}
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
                  onClick={onTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(formErrors.password)}
          helperText={formErrors.password}
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
          error={Boolean(formErrors.fullName)}
          helperText={formErrors.fullName}
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
          error={Boolean(formErrors.email)}
          helperText={formErrors.email}
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
          error={Boolean(formErrors.phone)}
          helperText={formErrors.phone}
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
          error={Boolean(formErrors.address)}
          helperText={formErrors.address}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            format="dd-MM-yyyy"
            value={newEmployee.dob}
            required
            onChange={(newValue) => onEmployeeUpdate({ dob: newValue })}
            renderInput={(params) => (
              <TextField
                inputRef={dobRef}
                {...params}
                margin="dense"
                fullWidth
                variant="outlined" />
            )}
            sx={{ my: 1 }}
            error={Boolean(formErrors.dob)}
            helperText={formErrors.dob}
          />
        </LocalizationProvider>
        <Select
          fullWidth
          label="Role"
          name="role"
          required
          variant="outlined"
          value={newEmployee.role ? newEmployee.role : 'EMPLOYEE'}
          onChange={(e) => onEmployeeUpdate({ role: e.target.value })}
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
            onChange={(e) => onEmployeeUpdate({ isActive: e.target.checked })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
                    Cancel
        </Button>
        <Button
          onClick={onSubmit}
          sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
        >
                    Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
