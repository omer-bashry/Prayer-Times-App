import { configureStore } from "@reduxjs/toolkit";
import prayersApiSlice from "../features/feachApiSlice";
import countDownReduser from "../features/countDownSlice";

export default configureStore({
  reducer: {
    prayersApi: prayersApiSlice,
    countDown: countDownReduser,
  },
});
