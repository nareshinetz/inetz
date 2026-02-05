

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = "http://localhost:8080";





// THUNKS

// Fetch all staff
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/staff`);
      return res.data;
    } catch (err) {
      // Use err.response.data or err.message based on your API structure
      return rejectWithValue(err.message);
    }
  }
);

// Add new staff member
export const addStaff = createAsyncThunk(
  "staff/addStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/staff`, staffData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Edit staff member
export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async (updatedStaffData, { rejectWithValue, dispatch }) => {
    try {
      // API call to update the staff member

      await axios.put(`${API_URL}/staff/${updatedStaffData.id}`, updatedStaffData);
      
      // Re-fetch the list to update the UI

      dispatch(fetchStaff());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete staff member
export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      // API call to delete the staff member

      await axios.delete(`${API_URL}/staff/${id}`);

      // Re-fetch the list to update the UI

      dispatch(fetchStaff());
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


//SlIcEEEE
const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staff: [], 
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    
    //Bro  We don't need reducers since all updates are done via Thunk'SSSsss
  },
  extraReducers: (builder) => {
    builder
      // Fetch Staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = action.payload; // Update staff array
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Staff
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staff.push(action.payload); // Optimistically add to state
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Staff (Note: we re-fetch the list, so no state manipulation here)
      .addCase(editStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Staff (Note: we re-fetch the list, so no state manipulation here)
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default staffSlice.reducer;


