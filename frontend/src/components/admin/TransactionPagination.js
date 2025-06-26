import { TablePagination } from '@mui/material';

function TransactionPagination({
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <TablePagination
      component="div"
      count={totalRecords}
      page={currentPage - 1}
      onPageChange={(e, newPage) => onPageChange(newPage)}
      rowsPerPage={pageSize}
      onRowsPerPageChange={(e) => onRowsPerPageChange(e.target.value)}
      rowsPerPageOptions={[5, 10, 20, 50]}
    />
  );
}

export default TransactionPagination;
