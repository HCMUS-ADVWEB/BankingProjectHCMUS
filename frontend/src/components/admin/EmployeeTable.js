import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination
} from "@mui/material";
import { Info, Delete } from "@mui/icons-material";

export default function EmployeeTable({
    employees,
    onRowClick,
    onEdit,
    onDelete,
    pagination,
    onPageChange
}) {
    return (
        <>
            <TableContainer component={Paper}>
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
                        {employees.map((emp) => (
                            <TableRow
                                key={emp.id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => onRowClick(emp)}
                            >
                                <TableCell>{emp.username}</TableCell>
                                <TableCell>{emp.fullName}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.phone}</TableCell>
                                <TableCell>{emp.role}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => onEdit(e, emp.id)}
                                    >
                                        <Info sx={{ color: "#90caf9" }} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => onDelete(e, emp)}
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
                    count={pagination.totalCount}
                    page={pagination.page}
                    onPageChange={onPageChange}
                    rowsPerPage={pagination.rowsPerPage}
                    rowsPerPageOptions={[pagination.rowsPerPage]}
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
        </>
    );
}