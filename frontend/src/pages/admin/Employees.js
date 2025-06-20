import { useState } from "react";
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
  TextField
} from "@mui/material";
import { Info, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

const dummyEmployees = [
  { id: "EMP001", name: "John Doe", email: "john@example.com", phone: "0987654321" },
  { id: "EMP002", name: "Jane Smith", email: "jane@example.com", phone: "0123456789" },
  { id: "EMP003", name: "Michael Brown", email: "michael@example.com", phone: "0223456789" },
  // add more employees as needed...
];

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    console.log("Move to employee:", id);
    navigate(`/admin/employees/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    console.log("Delete employee:", id);
    e.stopPropagation();
    setEmployeeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting employee:", employeeToDelete);
    // actual delete logic here
    setOpenDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
          Employees
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#fff" }}>
            Employee List
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#90caf9", color: "#121212" }}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Employee
          </Button>
        </Box>

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>Add New Employee</DialogTitle>
          <DialogContent sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "#fff" }, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Position"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "#fff" }, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "#fff" }, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "#fff" }, mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Address"
              fullWidth
              variant="outlined"
              sx={{ input: { color: "#fff" }, mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#1e1e1e" }}>
            <Button onClick={() => setOpenAddDialog(false)} sx={{ color: "#ccc" }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Submit logic here
                setOpenAddDialog(false);
              }}
              sx={{ color: "#90caf9" }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>



        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#1e1e1e", color: "#ccc" }}>
            Are you sure you want to delete employee <strong>{employeeToDelete}</strong>?
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#1e1e1e" }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{ color: "#ccc" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmDelete()}
              sx={{ color: "#f44336" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>


        <TableContainer component={Paper} sx={{ bgcolor: "#1e1e1e" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#90caf9" }}>ID</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Name</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Email</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Phone</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((emp) => (
                  <TableRow
                    key={emp.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin/employees/${emp.id}`)}
                  >
                    <TableCell sx={{ color: "#fff" }}>{emp.id}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{emp.name}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{emp.email}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{emp.phone}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(e, emp.id)}
                      >
                        <Info sx={{ color: "#90caf9" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteClick(e, emp.id)}
                      >
                        <Delete sx={{ color: "#f44336" }} />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={dummyEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            sx={{
              color: "#fff",
              ".MuiTablePagination-toolbar": { bgcolor: "#1e1e1e" },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                color: "#fff",
              },
              ".MuiSvgIcon-root": { color: "#90caf9" },
            }}
          />
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
