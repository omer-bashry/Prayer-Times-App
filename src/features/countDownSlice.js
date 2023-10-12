/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  timer: "",
  today: "",
  selectedCity: {
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  },
  nextPrayerIndex: 0,
};

export const countDoownSlice = createSlice({
  name: "countDown",
  initialState,
  reducers: {
    dispatchTimer: (state, action) => {
      state.timer = action.payload;
    },
    dispatchToday: (state, action) => {
      state.today = action.payload;
    },
    dispatchSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    dispatchNextPrayerIndex: (state, action) => {
      state.nextPrayerIndex = action.payload;
    },
  },
});

export const {
  dispatchTimer,
  dispatchToday,
  dispatchSelectedCity,
  dispatchNextPrayerIndex,
} = countDoownSlice.actions;
export default countDoownSlice.reducer;
