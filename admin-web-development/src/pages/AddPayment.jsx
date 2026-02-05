import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../redux/slices/studentSlice";

const paymentMethods = ["Cash", "GPay", "NEFT"];

const AddPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.students);

  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [payments, setPayments] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [payAmount, setPayAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  /* ================= FETCH STUDENT ================= */
  const handleFetchStudent = async () => {
    const foundStudent = students.find(
      (s) => String(s.id) === String(studentId)
    );

    if (!foundStudent) {
      setError("Student not found");
      setStudent(null);
      return;
    }

    setStudent(foundStudent);
    setDiscount(Number(foundStudent.discount || 0));
    setError("");

    // Fetch Course
    const courseRes = await fetch("http://localhost:8080/courses");
    const courseData = await courseRes.json();
    const foundCourse = courseData.find(
      (c) => c.id === foundStudent.courseId
    );
    setCourse(foundCourse);

    // Fetch Payments
    const paymentRes = await fetch("http://localhost:8080/payments");
    const paymentData = await paymentRes.json();
    setPayments(
      paymentData.filter(
        (p) => String(p.studentId) === String(studentId)
      )
    );
  };

  /* ================= CALCULATIONS ================= */
  const totalFee = course?.totalFee || 0;

  const amountPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const pendingFee = totalFee - discount - amountPaid;

  /* ================= SAVE PAYMENT ================= */
  const handlePayment = async () => {
    if (!payAmount || payAmount <= 0) {
      setError("Enter valid payment amount");
      return;
    }

    if (!paymentMethod) {
      setError("Select payment method");
      return;
    }

    if (discount > totalFee) {
      setError("Discount cannot exceed total fee");
      return;
    }

    if (
      (paymentMethod === "GPay" || paymentMethod === "NEFT") &&
      !transactionId
    ) {
      setError("Enter transaction ID for online payment");
      return;
    }

    await fetch("http://localhost:8080/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        amount: Number(payAmount),
        paymentMethod,
        transactionId:
          paymentMethod === "Cash" ? null : transactionId,
        date: new Date().toLocaleDateString(),
      }),
    });

    alert("Payment recorded successfully");
    navigate(-1);
  };

  /* ================= INFO ITEM ================= */
  const InfoItem = ({ label, value, highlight }) => (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={700} color={highlight ? "error" : "inherit"}>
        {value}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Breadcrumbs
  separator={<NavigateNextIcon fontSize="small" />}
  sx={{ mb: 2 }}
>
  <Link
    underline="hover"
    color="inherit"
    sx={{ cursor: "pointer" }}
    onClick={() => navigate("/")}
  >
    Dashboard
  </Link>

  <Link
    underline="hover"
    color="inherit"
    sx={{ cursor: "pointer" }}
    onClick={() => navigate("/payments")}
  >
    Payments
  </Link>

  <Typography color="text.primary" fontWeight={600}>
    Add Payment
  </Typography>
</Breadcrumbs>


      <Card variant="outlined">
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Student Payment
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Fetch student and record payment
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* ================= STUDENT ID ================= */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleFetchStudent}
              >
                Fetch Student
              </Button>
            </Grid>
          </Grid>

          {student && course && (
            <>
              {/* ================= STUDENT INFO ================= */}
              <Typography fontWeight={700} mb={1}>
                Student Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <InfoItem label="Student Name" value={student.studentName} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InfoItem label="Email" value={student.email} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InfoItem
                    label="Phone Number"
                    value={student.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <InfoItem label="Course" value={course.courseName} />
                </Grid>
              </Grid>

              {/* ================= FEE SUMMARY ================= */}
              <Typography fontWeight={700} mt={5} mb={1}>
                Fee Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <InfoItem label="Total Fee" value={`₹${totalFee}`} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Discount"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(Number(e.target.value || 0))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <InfoItem label="Paid Amount" value={`₹${amountPaid}`} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <InfoItem
                    label="Pending Amount"
                    value={`₹${pendingFee}`}
                    highlight
                  />
                </Grid>
              </Grid>

              {/* ================= NEW PAYMENT ================= */}
              <Typography fontWeight={700} mt={5} mb={1}>
                New Payment
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Amount to Pay"
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    sx={{ width: 190 }}
                    select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setTransactionId("");
                    }}
                  >
                    {paymentMethods.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {(paymentMethod === "GPay" ||
                  paymentMethod === "NEFT") && (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Transaction ID"
                        value={transactionId}
                        onChange={(e) =>
                          setTransactionId(e.target.value)
                        }
                      />
                    </Grid>
                  )}
              </Grid>

              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ mt: 4 }}
                onClick={handlePayment}
              >
                Record Payment
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPayment;
