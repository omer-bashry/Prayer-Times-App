/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPrayers = createAsyncThunk(
  "fetchingPrayers",
  async (city) => {
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${city}`
      );

      // Return only the data i need from the API response
      return response.data.data.timings;
    } catch (error) {
      throw error;
    }
  }
);

export const prayersApiSlice = createSlice({
  name: "fetchApi",
  initialState: {
    prayers: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prayers = action.payload;
      })
      .addCase(fetchPrayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default prayersApiSlice.reducer;
