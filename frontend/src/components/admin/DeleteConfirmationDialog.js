import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  employeeName,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper:  {
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
          Confirm Delete
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3, color: 'text.primary' }}>
        <Typography variant="body1">
          Are you sure you want to delete employee{' '}
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {employeeName || 'this employee'}
          </Typography>
          ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2 }}>
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
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: '#f44336',
            color: 'white',
            textTransform: 'none',
            borderRadius: 'shape.borderRadius',
            '&:hover': {
              bgcolor: '#d32f2f',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
