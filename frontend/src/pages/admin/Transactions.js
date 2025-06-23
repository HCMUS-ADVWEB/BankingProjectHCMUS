import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { 
  DatePicker,
  LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AdminLayout from "../../layouts/AdminLayout";

const bankList = ["All Banks", "Bank A", "Bank B", "Bank C"];

const mockTransactions = [
  { id: "TX001", bank: "Bank A", date: "2025-06-01", type: "Transfer", amount: 50000 },
  { id: "TX002", bank: "Bank B", date: "2025-06-03", type: "Deposit", amount: 72000 },
  { id: "TX003", bank: "Bank A", date: "2025-06-04", type: "Withdrawal", amount: 25000 },
  { id: "TX004", bank: "Bank C", date: "2025-06-10", type: "Transfer", amount: 38000 },
  { id: "TX005", bank: "Bank B", date: "2025-06-11", type: "Deposit", amount: 54000 },
];

export default function TransactionsPage() {
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredTransactions = mockTransactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      (selectedBank === "All Banks" || tx.bank === selectedBank) &&
      txDate.getFullYear() === selectedDate.getFullYear() &&
      txDate.getMonth() === selectedDate.getMonth()
    );
  });

  const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
          Transaction Details
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ color: "#90caf9", mb: 0.5 }}>
                Select Bank
              </Typography>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                sx={{ color: "#fff", bgcolor: "#1e1e1e", borderRadius: 1 }}
              >
                {bankList.map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: "#90caf9", mb: 0.5 }}>
              Select Month
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month"]}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{
                  bgcolor: "#1e1e1e",
                  input: { color: "#fff" },
                  svg: { color: "#90caf9" },
                  borderRadius: 1,
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ color: "#90caf9", mb: 2 }}>
          Total Transaction Amount: ${totalAmount.toLocaleString()}
        </Typography>

        <TableContainer component={Paper} sx={{ bgcolor: "#1e1e1e" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#90caf9" }}>Transaction ID</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Bank</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Date</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Type</TableCell>
                <TableCell sx={{ color: "#90caf9" }}>Amount ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell sx={{ color: "#fff" }}>{tx.id}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{tx.bank}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{tx.date}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{tx.type}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{tx.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: "#ccc", textAlign: "center" }}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
