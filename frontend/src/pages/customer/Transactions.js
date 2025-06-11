import React, { useEffect, useState } from "react";
import { useBanking } from "../../contexts/BankingContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

function CustomerTransactionsPage() {
  const { state, fetchTransactions } = useBanking();
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredTransactions = state.transactions
    .filter((transaction) => filter === "all" || transaction.type === filter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const getTransactionIcon = (type) => {
    switch (type) {
      case "receive":
        return "⬇️";
      case "transfer":
        return "⬆️";
      case "debt_payment":
        return "💰";
      default:
        return "💳";
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "receive":
        return "#28a745";
      case "transfer":
        return "#dc3545";
      case "debt_payment":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "receive":
        return "Money Received";
      case "transfer":
        return "Money Sent";
      case "debt_payment":
        return "Debt Payment";
      default:
        return "Transaction";
    }
  };

  if (state.loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <div className="fade-in">
          <Typography variant="h4" fontWeight="bold" mb={4}>
            📋 Transaction History
          </Typography>

          {/* Filters */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Filters & Sorting
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit, minmax(200px, 1fr))" },
                  gap: 2,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Transactions</MenuItem>
                    <MenuItem value="receive">Money Received</MenuItem>
                    <MenuItem value="transfer">Money Sent</MenuItem>
                    <MenuItem value="debt_payment">Debt Payments</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Transaction Statistics */}
          <Box className="stats-grid" sx={{ mb: 4 }}>
            <Card className="stat-card">
              <CardContent>
                <Typography className="stat-value" variant="h5" fontWeight="bold">
                  {state.transactions.length}
                </Typography>
                <Typography className="stat-label" color="text.secondary">
                  Total Transactions
                </Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography className="stat-value" variant="h5" fontWeight="bold">
                  {state.transactions.filter((t) => t.type === "receive").length}
                </Typography>
                <Typography className="stat-label" color="text.secondary">
                  Money Received
                </Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography className="stat-value" variant="h5" fontWeight="bold">
                  {state.transactions.filter((t) => t.type === "transfer").length}
                </Typography>
                <Typography className="stat-label" color="text.secondary">
                  Money Sent
                </Typography>
              </CardContent>
            </Card>
            <Card className="stat-card">
              <CardContent>
                <Typography className="stat-value" variant="h5" fontWeight="bold">
                  {new Intl.NumberFormat("vi-VN").format(
                    state.transactions.filter((t) => t.type === "receive").reduce((sum, t) => sum + t.amount, 0)
                  )}{" "}
                  VND
                </Typography>
                <Typography className="stat-label" color="text.secondary">
                  Total Received
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Transactions List */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Transactions ({filteredTransactions.length})
              </Typography>
              {filteredTransactions.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h1" mb={2}>
                    📋
                  </Typography>
                  <Typography variant="h5" mb={2} color="text.primary">
                    No Transactions Found
                  </Typography>
                  <Typography color="text.secondary">
                    {filter === "all" ? "You haven't made any transactions yet" : `No ${filter} transactions found`}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {filteredTransactions.map((transaction) => (
                    <Box
                      key={transaction.id}
                      className="transaction-item"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 2,
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <Box
                        className="transaction-icon"
                        sx={{
                          bgcolor: `${getTransactionColor(transaction.type)}20`,
                          color: getTransactionColor(transaction.type),
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          mr: 2,
                        }}
                      >
                        {getTransactionIcon(transaction.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {getTransactionLabel(transaction.type)}
                            </Typography>
                            <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                              {transaction.type === "transfer" && transaction.fromAccountNumber && (
                                <Typography variant="body2">From: {transaction.fromAccountNumber}</Typography>
                              )}
                              <Typography variant="body2">To: {transaction.toAccountNumber}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{ color: getTransactionColor(transaction.type) }}
                            >
                              {transaction.type === "receive" ? "+" : "-"}
                              {new Intl.NumberFormat("vi-VN").format(transaction.amount)} VND
                            </Typography>
                            {transaction.fee > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Fee: {new Intl.NumberFormat("vi-VN").format(transaction.fee)} VND
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Message: {transaction.message}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor:
                                transaction.status === "completed"
                                  ? "#d4edda"
                                  : transaction.status === "pending"
                                    ? "#fff3cd"
                                    : "#f8d7da",
                              color:
                                transaction.status === "completed"
                                  ? "#155724"
                                  : transaction.status === "pending"
                                    ? "#856404"
                                    : "#721c24",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {transaction.status.toUpperCase()}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default CustomerTransactionsPage;