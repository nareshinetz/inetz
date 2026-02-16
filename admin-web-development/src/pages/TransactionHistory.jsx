import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "../redux/slices/transacitonSlice";
import AgGridTable from "../generic/AgGridTable";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { transactions = [], loading = false, error = null } =
    useSelector((state) => state.transactions || {});

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/transactions/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/transactions/view/${id}`);
  };

  const transactionColumns = useMemo(
    () => [
      {
        headerName: "Student ID",
        field: "studentId",
        filter: true,
        cellRenderer: (params) => (
          <Typography
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => handleView(params.data.paymentId)}
          >
            {params.value}
          </Typography>
        ),
      },
            {
        headerName: "Payment Date",
        field: "paymentDate",
        sortable: true,
      },
      {
        headerName: "Student Name",
        field: "studentName",
      },
      {
        headerName: "Paid Amount",
        valueGetter: (params) => `₹${params.data.paidAmount || 0}`,
        sortable: true,
      },
      {
        headerName: "Payment Mode",
        valueGetter: (params) => params.data.paymentMode || "-",
        filter: true,
      },
      {
        headerName: "Status",
        field: "status",
        filter: true,
      },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton color="warning" onClick={() => handleEdit(params.data.paymentId)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(params.data.paymentId)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [navigate]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: "100%", maxWidth: 400, m: "auto" }}>
        Failed to load transactions: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Transactions List
      </Typography>

      <Card>
        <CardContent>
          <AgGridTable
            rowData={transactions || []}
            columnDefs={transactionColumns}
            loadingMessage="Fetching transactions..."
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionHistory;
