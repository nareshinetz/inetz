import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourse,
  editCourse,
  fetchCourseById,
} from "../redux/slices/courseSlice";

const instructorOptions = [
  "John Doe",
  "Vijay Kumar",
  "Priya Sharma",
  "Raj Patel",
];

const initialState = {
  courseName: "",
  courseCode: "",
  price: "",
  instructor: "",
  duration: "",
};

const AddCourse = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCourse, loading, error } = useSelector(
    (state) => state.courses
  );

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  /* ================= FETCH COURSE (EDIT MODE) ================= */
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id, isEditMode]);

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (isEditMode && selectedCourse) {
      setFormData({
        courseName: selectedCourse.courseName || "",
        courseCode: selectedCourse.courseCode || "",
        price: selectedCourse.price || "",
        instructor: selectedCourse.instructor || "",
        duration: selectedCourse.duration || "",
      });
    }
  }, [selectedCourse, isEditMode]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "duration"
          ? Number(value)
          : value,
    }));

    setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) errors[key] = true;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await dispatch(editCourse({ id, ...formData })).unwrap();
      } else {
        await dispatch(addCourse(formData)).unwrap();
      }

      setSuccess(true);
      setTimeout(() => navigate("/listcourse"), 1200);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  /* ================= SUCCESS ================= */
  if (success) {
    return (
      <Alert severity="success" sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
        {isEditMode
          ? "Course Updated Successfully!"
          : "Course Added Successfully!"}
      </Alert>
    );
  }

  /* ================= UI ================= */

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isEditMode ? "Edit Course" : "Add New Course"}
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <SchoolIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={600}>
              Course Information
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {[
                { label: "Course Name", name: "courseName" },
                { label: "Course Code", name: "courseCode" },
              ].map((field) => (
                <Grid item xs={12} md={4} key={field.name}>
                  <TextField
                    label={`${field.label} *`}
                    name={field.name}
                    fullWidth
                    value={formData[field.name]}
                    onChange={handleChange}
                    error={formErrors[field.name]}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={4}>
                <TextField
                  label="Course Fees *"
                  name="price"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={handleChange}
                  error={formErrors.price}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Trainer *"
                  name="instructor"
                  fullWidth
                  value={formData.instructor}
                  onChange={handleChange}
                  error={formErrors.instructor}
                >
                  {instructorOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Duration (Months) *"
                  name="duration"
                  type="number"
                  fullWidth
                  value={formData.duration}
                  onChange={handleChange}
                  error={formErrors.duration}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={() => navigate("/listcourse")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {isEditMode ? "Update Course" : "Create Course"}
              </Button>
            </Box>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddCourse;
