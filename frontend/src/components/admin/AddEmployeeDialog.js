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
  Grid,
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
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 'shape.borderRadius',
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'scale(0.9)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
          color: 'white',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add New Employee
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6 }}>
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
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
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
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onTogglePasswordVisibility}
                      edge="end"
                      sx={{
                        color: 'white',
                        bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                        '&:hover': {
                          bgcolor: 'linear-gradient(to right, #059669, #0284c7)',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              inputRef={fullNameRef}
              margin="dense"
              label="Full Name"
              name="fullName"
              value={newEmployee.fullName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              error={Boolean(formErrors.fullName)}
              helperText={formErrors.fullName}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              inputRef={emailRef}
              margin="dense"
              label="Email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              inputRef={phoneRef}
              margin="dense"
              label="Phone"
              name="phone"
              value={newEmployee.phone}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              error={Boolean(formErrors.phone)}
              helperText={formErrors.phone}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              inputRef={addressRef}
              margin="dense"
              label="Address"
              name="address"
              value={newEmployee.address}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              required
              error={Boolean(formErrors.address)}
              helperText={formErrors.address}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                format="dd-MM-yyyy"
                value={newEmployee.dob}
                onChange={(newValue) => onEmployeeUpdate({ dob: newValue })}
                slotProps={{
                  textField: {
                    inputRef: dobRef,
                    margin: 'dense',
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    error: Boolean(formErrors.dob),
                    helperText: formErrors.dob,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Select
              fullWidth
              name="role"
              value={newEmployee.role ? newEmployee.role : 'EMPLOYEE'}
              onChange={(e) => onEmployeeUpdate({ role: e.target.value })}
              variant="outlined"
              margin="dense"
              sx={{
                my: 1,
                borderRadius: 'shape.borderRadius',
              }}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
            </Select>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
              <Typography
                sx={{ color: 'text.primary', fontWeight: 600, mr: 2 }}
                variant="body2"
              >
                Active:
              </Typography>
              <Checkbox
                checked={newEmployee.isActive}
                onChange={(e) => onEmployeeUpdate({ isActive: e.target.checked })}
                sx={{ color: 'divider' }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
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
          onClick={onSubmit}
          variant="contained"
          sx={{
            bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
            color: 'white',
            textTransform: 'none',
            borderRadius: 'shape.borderRadius',
            px: 3,
            '&:hover': {
              bgcolor: 'linear-gradient(to right, #059669, #0284c7)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
