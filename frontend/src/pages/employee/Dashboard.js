import { useState } from 'react';
import EmployeeLayout from '../../layouts/EmployeeLayout';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  Chip,
  Badge,

} from '@mui/material';
import {  LineChart, PieChart, ScatterChart } from '@mui/x-charts';

// Sample data for sections
const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
];

export default function EmployeeDashboard() {
  const { state } = useAuth();
  // State for interactive components
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Handlers for components
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <EmployeeLayout>
      <Container maxWidth="xl" sx={{ py: 4, bgcolor: 'background.default' }}>
        {/* SECTION 0: Dashboard Overview */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}
          >
            Welcome, {state.user?.fullName || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your dashboard provides a quick overview of key metrics and actions.
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ sx: 12, sm: 6, md: 6}}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  1,234
                </Typography>
                <Chip
                  onClick={() => {}}
                  label="+5% this month"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
            <Grid item size={{ sx: 12, sm: 6, md: 6}}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Revenue
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  $56,789
                </Typography>
                <Chip
                  onClick={() => {}}
                  label="+12% this month"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
            <Grid item size={{ sx: 12, sm: 6, md: 6}}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  Active Projects
                </Typography>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                >
                  42
                </Typography>
                <Badge badgeContent={3} color="error" sx={{ mt: 1 }}>
                  <Chip label="Pending" size="small" onClick={() => {}} />
                </Badge>
              </Card>
            </Grid>
            <Grid item size={{ sx: 12, sm: 6, md: 6}}>
              <Card sx={{ p: 2, borderRadius: 'shape.borderRadius' }}>
                <Typography variant="h6" color="text.primary">
                  System Status
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  All systems operational
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography variant="h5" color="text.primary">
                  Quick Actions
                </Typography>
                <Button variant="outlined" color="primary">
                  View All
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* SECTION 6: Table */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📊 Table
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display data in a tabular format with pagination.
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: 'shape.borderRadius' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>


        {/* SECTION 19: Charts & Visualizations */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 'shape.borderRadius',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            📉 Charts & Visualizations
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Diverse chart types for comprehensive data visualization.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Pie Chart
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'A' },
                      { id: 1, value: 15, label: 'B' },
                      { id: 2, value: 20, label: 'C' },
                    ],
                  },
                ]}
                height={200}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Line Chart
              </Typography>
              <LineChart
                series={[{ data: [2, 5, 3, 8, 6] }]}
                height={200}
                xAxis={[
                  {
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    scaleType: 'point',
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Scatter Chart
              </Typography>
              <ScatterChart
                series={[
                  {
                    label: 'Series A',
                    data: [
                      { x: 1, y: 2, id: '1' },
                      { x: 2, y: 5, id: '2' },
                      { x: 3, y: 3, id: '3' },
                      { x: 4, y: 8, id: '4' },
                    ],
                  },
                ]}
                height={200}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight={600}
                gutterBottom
              >
                Sparkline
              </Typography>
              <LineChart
                series={[{ data: [1, 3, 2, 5, 4, 6, 3] }]}
                height={100}
                xAxis={[
                  {
                    data: [1, 2, 3, 4, 5, 6, 7],
                    scaleType: 'point',
                    hide: true,
                  },
                ]}
                yAxis={[{ hide: true }]}
                sx={{ '& .MuiChartsAxis-root': { display: 'none' } }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </EmployeeLayout>
  );
}
