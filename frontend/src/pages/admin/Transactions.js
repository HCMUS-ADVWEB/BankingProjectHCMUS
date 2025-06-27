import { useState, useEffect } from 'react';
import { Box, Typography, Container, Backdrop, CircularProgress, Paper, Avatar } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import AdminLayout from '../../layouts/AdminLayout';
import {
  useTransaction,
  TransactionProvider,
} from '../../contexts/admin/BankTransactionsContext';
import TransactionFilter from '../../components/admin/TransactionFilter';
import TransactionTable from '../../components/admin/TransactionTable';
import TransactionPagination from '../../components/admin/TransactionPagination';
import TransactionSummary from '../../components/admin/TransactionSummary';

function TransactionsPageContent() {
  const {
    banks,
    transactions,
    statistics,
    fetchBanks,
    fetchTransactions,
    fetchStatistics,
    loading,
    error,
    currentPage,
    pageSize,
  } = useTransaction();

  const [selectedBank, setSelectedBank] = useState('All Banks');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toVietnamISOString = (date) => {
    const vnDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return vnDate.toISOString().split('T')[0];
  };

  const startDate = toVietnamISOString(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const endDate = toVietnamISOString(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
  );

  // Load banks list once
  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // Load transaction + statistics when filter changes
  useEffect(() => {
    fetchTransactions({
      startDate,
      endDate,
      bankCode: selectedBank === 'All Banks' ? null : selectedBank,
      limit: rowsPerPage,
      page,
    });

    fetchStatistics({
      startDate,
      endDate,
      bankCode: selectedBank === 'All Banks' ? null : selectedBank,
      limit: rowsPerPage,
      page,
    });
  }, [
    selectedBank,
    selectedDate,
    page,
    rowsPerPage,
    fetchTransactions,
    fetchStatistics,
    endDate,
    startDate,
  ]);

  const handleBankChange = (value) => {
    setSelectedBank(value);
    setPage(1);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(parseInt(value, 10));
    setPage(1);
  };

  if (loading && transactions === undefined) return (
    <Container maxWidth="2xl"
      sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );

  return (
    <AdminLayout>
      <TransactionProvider>
        <Container maxWidth="2xl"
          sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}
        >
          {/* Header Section */}
          <Paper
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 'shape.borderRadius',
              bgcolor: 'background.paper',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              animation: 'fadeIn 1s ease-in-out',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(-20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
              '&:hover': {
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(to right, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'linear-gradient(to right, #10b981, #06b6d4)',
                      color: 'white',
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <HistoryIcon />
                  </Avatar>
                  Transactions List
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  View transactions list details.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Loading Backdrop */}
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <TransactionFilter
            selectedBank={selectedBank}
            selectedDate={selectedDate}
            banks={banks}
            onBankChange={handleBankChange}
            onDateChange={handleDateChange}
          />

          <TransactionSummary
            statistics={statistics ? statistics.totalAmount : 0}
          />

          {error ? (
            <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>
          ) : (
            <>
              <TransactionTable transactions={transactions} />

              <TransactionPagination
                totalRecords={statistics ? statistics.totalTransactions : 0}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </Container>
      </TransactionProvider>
    </AdminLayout>
  );
}

export default function TransactionsPage() {
  return (
    <TransactionProvider>
      <TransactionsPageContent />
    </TransactionProvider>
  );
}
