import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    id: 0,
    first_name: "string",
    last_name: "string",
    email: "string",
    role: "string",
    user_detail: {
      survey: "string",
      survey_detail: "string",
      phone_number: "string",
      city: "string",
      country: "string",
    },
  },
  reducers: {
    setStoreUserInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setStoreUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
