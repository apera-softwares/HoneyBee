import { BACKEND_API } from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async get UserProfile Thunk
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_,thunkAPI) => {
    try {  
        const state: any = thunkAPI.getState();
        const id = state.user?.user?.userId;
        const token = state.user?.user?.token;
      const request = await axios.get(`${BACKEND_API}user/getUser/${id}`,  {
        headers: { 
            Authorization: `Bearer ${token}`, 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      const response = request.data.user;
      //console.log(response, "User Profile response");

      return response;
    } catch (error: any) {
      console.log(error, "User Profile error");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


interface UserState {
  userProfile: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userProfile:{} ,
  loading: false,
  error: null,
};


const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {

    resetUserProfile(state) {
      state.userProfile = null;
      state.loading = false;
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    // get Login Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.userProfile = null;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.userProfile = null;
        if (action.error.message === "Request failed with Status code 401") {
          state.error = "Access Denied!";
        } else {
          state.error = action.payload as string;
        }
      });
    }
   
});

export const {resetUserProfile} = userProfileSlice.actions
export default userProfileSlice.reducer;
