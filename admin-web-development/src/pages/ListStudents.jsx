import React, { useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, deleteStudent } from "../redux/slices/studentSlice";
import AgGridTable from "../generic/AgGridTable";
import { useNavigate } from "react-router-dom";

const ListStudents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, loading, error } = useSelector(
    (state) => state.students
  );

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(id));
    }
  };

  const handleEdit = (id) => {
    console.log("Edit student:", id);
    navigate(`/students/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/students/view/${id}`)
    }

  const studentColumns = useMemo(
    () => [
      { headerName: "Name", field: "studentName", sortable: true, filter: true },
      { headerName: "Email", field: "emailId", filter: true },
      { headerName: "Phone", field: "phoneNumber" },
      { headerName: "Program", field: "programType", filter: true },
      { headerName: "Status", field: "status", filter: true },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <div>
            <button
              style={{ marginRight: 8 }}
              onClick={() => handleView(params.data.id)}
            >
              View
            </button>
            <button
              style={{ marginRight: 8 }}
              onClick={() => handleEdit(params.data.id)}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(params.data.id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: "100%", maxWidth: 400, m: "auto" }}>
        Failed to load students: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Students List
      </Typography>

      <Card>
        <CardContent>
          <AgGridTable
            rowData={students || []}
            columnDefs={studentColumns}
            loadingMessage="Fetching students..."
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ListStudents;