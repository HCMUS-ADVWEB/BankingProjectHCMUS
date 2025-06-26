import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  employeeName,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
                Confirm Delete
      </DialogTitle>
      <DialogContent>
                Are you sure you want to delete employee <strong>{employeeName}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
                    Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ color: '#f44336' }}
        >
                    Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
