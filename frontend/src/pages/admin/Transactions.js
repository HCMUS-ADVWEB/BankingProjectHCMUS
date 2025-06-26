import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AdminLayout from '../../layouts/AdminLayout';
import { useTransaction, TransactionProvider } from '../../contexts/admin/BankTransactionsContext';
import Loading from '../../components/Loading';
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
    const vnDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return vnDate.toISOString().split('T')[0];
  };

  const startDate = toVietnamISOString(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const endDate = toVietnamISOString(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));

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

  }, [selectedBank, selectedDate, page, rowsPerPage, fetchTransactions, fetchStatistics, endDate, startDate]);

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

  if (loading) return <Loading />;

  return (
    <AdminLayout>
      <TransactionProvider>
        <Box sx={{bgcolor: 'background.default', p: 3}}>
          <Typography variant="h4" gutterBottom>
            Transaction Details
          </Typography>

          <TransactionFilter
            selectedBank={selectedBank}
            selectedDate={selectedDate}
            banks={banks}
            onBankChange={handleBankChange}
            onDateChange={handleDateChange}
          />

          <TransactionSummary statistics={statistics ? statistics.totalAmount : 0} />

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
        </Box>
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
