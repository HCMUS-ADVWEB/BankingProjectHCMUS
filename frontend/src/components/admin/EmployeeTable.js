import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Typography,
  Chip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function EmployeeTable({
  employees,
  onRowClick,
  onDelete,
  pagination,
  onPageChange,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 'shape.borderRadius',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary'}}>
              <Typography variant="body2">Username</Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary'}}>
              <Typography variant="body2">Full Name</Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
              <Typography variant="body2">Email</Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
              <Typography variant="body2">Phone</Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}>
              <Typography variant="body2">Role</Typography>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>
              <Typography variant="body2">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow
              key={emp.id}
              hover
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transition: 'all 0.3s ease',
                },
              }}
              onClick={() => onRowClick(emp)}
            >
              <TableCell>
                <Typography variant="body2" color="text.primary">
                  {emp.username}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.primary">
                  {emp.fullName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.primary">
                  {emp.email}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.primary">
                  {emp.phone}
                </Typography>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Chip
                  size="small"
                  label={emp.role}
                  sx={{
                    background: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <IconButton
                  size="small"
                  onClick={(e) => onDelete(e, emp)}
                  sx={{ color: '#f44336' }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={pagination.totalCount}
        page={pagination.page}
        onPageChange={onPageChange}
        rowsPerPage={pagination.rowsPerPage}
        rowsPerPageOptions={[pagination.rowsPerPage]}
      />
    </TableContainer>
  );
}
