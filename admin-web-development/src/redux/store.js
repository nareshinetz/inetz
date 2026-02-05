import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../redux/slices/userSlice";
import studentReducer from "../redux/slices/studentSlice";
import staffReducer from "../redux/slices/staffSlice";
import leadsReducer from "../redux/slices/leadsSlice";
import courseReducer from "./slices/courseSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    students: studentReducer,
    staff: staffReducer,
    leads: leadsReducer,
    course: courseReducer,
  },
});

export default store;