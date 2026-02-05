import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

//  Thunks

// Fetch all studs
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add new student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/students`, studentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Edit student
export const editStudent = createAsyncThunk(
  "students/editStudent",
  async (updatedStudent, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/students/${updatedStudent.id}`,
        updatedStudent
      );
      return data; // return updated student
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


// Delete student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`${API_URL}/students/${id}`);
      dispatch(fetchStudents());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add student
      .addCase(addStudent.pending, (state, action) => {
        state.loading = true;

        const index = state.students.findIndex(
          (s) => s.id === action.payload.id
        );

        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit student
      .addCase(editStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(editStudent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
