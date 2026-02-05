import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, editStudent } from "../redux/slices/studentSlice";

/* ---------- Styled Components ---------- */

const Section = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  background: alpha(theme.palette.background.paper, 0.9),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  marginBottom: theme.spacing(3),
}));

const Field = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
  },
}));

const ActionBar = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2.5),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  background: alpha(theme.palette.background.paper, 0.95),
  zIndex: 1200,
}));

/* ---------- Component ---------- */

const EditStudent = () => {
  const theme = useTheme();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { students, loading } = useSelector((state) => state.students);
  const student = students.find((s) => String(s.id) === id);

  const [formData, setFormData] = useState({
    studentName: "",
    emailId: "",
    phoneNumber: "",
    programType: "",
    modeOfTraining: "",
    courseName: "",
    trainerName: "",
    courseTiming: "",
    batchStartDate: "",
    batchEndDate: "",
    collegeName: "",
    degree: "",
    department: "",
    cityName: "",
    yearOfStudy: "",
    sslcMark: "",
    hscMark: "",
    ugMark: "",
    pgMark: "",
    status: "",
    comments: "",
  });

  useEffect(() => {
    if (!students.length) dispatch(fetchStudents());
  }, [students.length, dispatch]);

  useEffect(() => {
    if (student) setFormData(student);
  }, [student]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await dispatch(editStudent(formData));
    navigate("/students/list");
  };

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!student) return <Typography align="center">Student not found</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 14 }}>
      <Typography variant="h4" fontWeight={800} mb={4}>
        Edit Student
      </Typography>

      {/* Student Info */}
      <Section>
        <SectionTitle>Student Information</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Field label="Student Name" name="studentName" value={formData.studentName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field label="Email" name="emailId" value={formData.emailId} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </Section>

      {/* Course Info */}
      <Section>
        <SectionTitle>Course Information</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Field label="Program Type" name="programType" value={formData.programType} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field label="Mode of Training" name="modeOfTraining" value={formData.modeOfTraining} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field label="Course Name" name="courseName" value={formData.courseName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field label="Trainer" name="trainerName" value={formData.trainerName} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </Section>

      {/* Batch */}
      <Section>
        <SectionTitle>Batch Details</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Field type="date" label="Start Date" name="batchStartDate" InputLabelProps={{ shrink: true }} value={formData.batchStartDate} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field type="date" label="End Date" name="batchEndDate" InputLabelProps={{ shrink: true }} value={formData.batchEndDate} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </Section>

      {/* Education */}
      <Section>
        <SectionTitle>Education</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Field label="College" name="collegeName" value={formData.collegeName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field label="Degree" name="degree" value={formData.degree} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={3}>
            <Field label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </Section>

      {/* Marks */}
      <Section>
        <SectionTitle>Academic Marks</SectionTitle>
        <Grid container spacing={3}>
          {["sslcMark", "hscMark", "ugMark", "pgMark"].map((field) => (
            <Grid item xs={12} md={3} key={field}>
              <Field label={field.toUpperCase()} name={field} value={formData[field]} onChange={handleChange} fullWidth />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Status */}
      <Section>
        <SectionTitle>Status & Comments</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                <MenuItem value="Registered">Registered</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Field label="Comments" name="comments" value={formData.comments} onChange={handleChange} multiline rows={3} fullWidth />
          </Grid>
        </Grid>
      </Section>

      {/* Action Bar */}
      <ActionBar>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate("/students/list")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Update Student
          </Button>
        </Stack>
      </ActionBar>
    </Box>
  );
};

export default EditStudent;
