import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

export default function EmployeeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dummy employee data (replace with real API fetch later)
    const employee = {
        id: id,
        name: "John Doe",
        position: "Manager",
        email: "john@example.com",
        phone: "+1 234 567 890",
        address: "123 Elm Street, NY",
    };

    const handleDeleteConfirm = () => {
        console.log("Delete employee", id);
        setOpenDeleteDialog(false);
        // delete logic
        navigate("/admin/employees"); // Redirect after deletion
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditedEmployee({ ...employee });
        setEditMode(false);
    };

    const handleSave = () => {
        console.log("Saved data:", editedEmployee);
        // call API here
        setEditMode(false);
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState({ ...employee });


    return (
        <AdminLayout>
            <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" sx={{ color: "#fff" }}>
                        Employee Details
                    </Typography>
                </Box>

                <Card sx={{ bgcolor: "#1e1e1e", color: "#fff", mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">ID: {employee.id}</Typography>
                            <Box>
                                {editMode ? (
                                    <>
                                        <Button size="small" sx={{ color: "#90caf9" }} onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button size="small" sx={{ color: "#ccc" }} onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <IconButton onClick={handleEdit}>
                                            <Edit sx={{ color: "#90caf9" }} />
                                        </IconButton>
                                        <IconButton onClick={() => setOpenDeleteDialog(true)}>
                                            <Delete sx={{ color: "#f44336" }} />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </Box>

                        {/* Editable Fields */}
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Name:</strong>{" "}
                            {editMode ? (
                                <input
                                    value={editedEmployee.name}
                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                                    style={{ background: "#1e1e1e", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: "4px 8px" }}
                                />
                            ) : (
                                employee.name
                            )}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Position:</strong>{" "}
                            {editMode ? (
                                <input
                                    value={editedEmployee.position}
                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
                                    style={{ background: "#1e1e1e", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: "4px 8px" }}
                                />
                            ) : (
                                employee.position
                            )}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Email:</strong>{" "}
                            {editMode ? (
                                <input
                                    value={editedEmployee.email}
                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                    style={{ background: "#1e1e1e", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: "4px 8px" }}
                                />
                            ) : (
                                employee.email
                            )}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Phone:</strong>{" "}
                            {editMode ? (
                                <input
                                    value={editedEmployee.phone}
                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                                    style={{ background: "#1e1e1e", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: "4px 8px" }}
                                />
                            ) : (
                                employee.phone
                            )}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Address:</strong>{" "}
                            {editMode ? (
                                <input
                                    value={editedEmployee.address}
                                    onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })}
                                    style={{ background: "#1e1e1e", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: "4px 8px" }}
                                />
                            ) : (
                                employee.address
                            )}
                        </Typography>
                    </CardContent>

                </Card>


                <Button
                    variant="outlined"
                    sx={{ color: "#90caf9", borderColor: "#90caf9" }}
                    onClick={() => navigate("/admin/employees")}
                >
                    Back to Employee List
                </Button>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent sx={{ bgcolor: "#1e1e1e", color: "#ccc" }}>
                        Are you sure you want to delete employee <strong>{id}</strong>?
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: "#1e1e1e" }}>
                        <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: "#ccc" }}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} sx={{ color: "#f44336" }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
}
