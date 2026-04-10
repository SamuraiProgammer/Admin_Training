import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    error: false,
    loading: false,
    email: "",
  },
  reducers: {
    userDetails(state, action) {
      console.log(state);
      console.log(action.payload);
      
      state.currentUser = action.payload; // Update only the currentUser field
    },
    logout(state) {
      console.log("logout called");
      
      state.currentUser = null; // Reset currentUser to null on logout
    },
  },
});
export default userSlice.reducer;
export const { userDetails,logout } = userSlice.actions;
