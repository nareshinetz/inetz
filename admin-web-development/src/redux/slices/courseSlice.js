// redux/slices/courseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// ---------------- THUNKS ----------------

// Fetch all courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/courses`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add new course
export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/courses`, courseData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Edit existing course
export const editCourse = createAsyncThunk(
  "courses/editCourse",
  async (updatedCourseData, { rejectWithValue, dispatch }) => {
    try {
      await axios.put(`${API_URL}/courses/${updatedCourseData.id}`, updatedCourseData);

      // Re-fetch courses list to update UI
      dispatch(fetchCourses());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete course
export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${API_URL}/courses/${id}`);

      // Re-fetch courses list to update UI
      dispatch(fetchCourses());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------------- SLICE ----------------
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    // No extra reducers needed as we handle via thunks
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Course
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Course
      .addCase(editCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
