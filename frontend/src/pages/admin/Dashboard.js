import { useState, useEffect, useMemo } from "react";
import {
  Box, Grid, Typography, Card, CardContent, FormControl, Select, MenuItem
} from "@mui/material";
import {
  DatePicker, LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BarChart } from "@mui/x-charts";
import AdminLayout from "../../layouts/AdminLayout";
import Loading from "../../components/Loading";
import {
  BankStatisticsProvider,
  useBankStatistics
} from "../../contexts/admin/BankStatisticsContext";

export function DashboardContent() {
  const {
    statisticsByMonth,
    totalYearTransactions,
    totalYearAmount,
    banks,
    loading,
    error,
    fetchBanks,
    fetchStatisticsForYear
  } = useBankStatistics();

  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedYear = selectedDate.getFullYear();

  // Fetch banks when component mount
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Fetch statistics when bank or year changes
  useEffect(() => {
    fetchStatisticsForYear({
      year: selectedYear,
      bankCode: selectedBank === "All Banks" ? null : selectedBank,
    });
  }, [selectedBank, selectedYear, fetchStatisticsForYear]);

  const bestMonth = useMemo(() => {
    if (statisticsByMonth.length === 0) return "-";
    return statisticsByMonth.reduce((a, b) =>
      a.totalAmount > b.totalAmount ? a : b
    ).month;
  }, [statisticsByMonth]);

  const averageAmount = useMemo(() => {
    if (statisticsByMonth.length === 0) return 0;
    return Math.round(totalYearAmount / statisticsByMonth.length);
  }, [statisticsByMonth, totalYearAmount]);

  if (loading) return <Loading />;

  return (
    <AdminLayout>
      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
          Bank Transaction Statistics
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 0.5 }}>
                Select Bank
              </Typography>
              <Select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                sx={{ borderRadius: "shape.borderRadius" }}
              >
                <MenuItem value="All Banks">All Banks</MenuItem>
                {banks.map((bank) => (
                  <MenuItem key={bank.bankCode} value={bank.bankCode}>
                    {bank.bankName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 0.5 }}>
              Select Year
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year"]}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{
                  input: { color: "text.secondary" },
                  borderRadius: "shape.borderRadius",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#90caf9" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#90caf9" },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "background.paper", color: "text.primary" }}>
              <CardContent>
                <Typography variant="h6">Total Transaction Volume</Typography>
                <Typography variant="h5" color="success.main">
                  {totalYearAmount.toLocaleString()} VNĐ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "background.paper", color: "text.primary" }}>
              <CardContent>
                <Typography variant="h6">Total Transactions</Typography>
                <Typography variant="h5" color="success.main">
                  {totalYearTransactions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "background.paper", color: "text.primary" }}>
              <CardContent>
                <Typography variant="h6">Best Month</Typography>
                <Typography variant="h5" color="success.main">
                  Tháng {bestMonth}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "background.paper", color: "text.primary" }}>
              <CardContent>
                <Typography variant="h6">Average Monthly Volume</Typography>
                <Typography variant="h5" color="info.main">
                  {averageAmount.toLocaleString()} VNĐ
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ bgcolor: "background.paper", color: "text.primary" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Volume by Month ({selectedBank})
            </Typography>
            <BarChart
              xAxis={[{
                scaleType: "band",
                data: statisticsByMonth.map((item) => `Thg ${item.month}`),
                label: "Month",
              }]}
              series={[{
                data: statisticsByMonth.map((item) => item.totalAmount),
                label: "Transaction Amount (VNĐ)",
              }]}
              height={300}
              margin={{ top: 20, right: 30, bottom: 30, left: 60 }}
              yAxis={[{
                label: "Amount (VNĐ)",
                valueFormatter: (value) => `${value.toLocaleString()}`,
              }]}
            />
          </CardContent>
        </Card>

        {error && (
          <Typography sx={{ color: "red", mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <BankStatisticsProvider>
      <DashboardContent />
    </BankStatisticsProvider>
  );
}
