import React from "react";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function TransactionFilter({
  selectedBank,
  selectedDate,
  banks,
  onBankChange,
  onDateChange,
}) {
  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 0.5 }}>
            Select Bank
          </Typography>
          <Select
            value={selectedBank}
            onChange={(e) => onBankChange(e.target.value)}
            sx={{borderRadius: "shape.borderRadius" }}
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
          Select Month
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={["year", "month"]}
            value={selectedDate}
            onChange={(newValue) => onDateChange(newValue)}
            sx={{
              input: { color: "text.secondary" },
              borderRadius: "shape.borderRadius",
            }}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}

export default TransactionFilter;