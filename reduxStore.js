import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./src/app/AuthSlice"
// import userDetails from '../'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // user: userDetails
  }
})