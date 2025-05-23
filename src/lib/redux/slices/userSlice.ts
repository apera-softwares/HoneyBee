import { BACKEND_API } from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Get user from localStorage if available
const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null, 
  loading: false,
  error: null,
};

// Async Signup Thunk
export const userSignup = createAsyncThunk(
  "user/signupUser",
  async (obj: any, thunkAPI) => {
    try {
      const request = await axios.post(`${BACKEND_API}user/create`, obj, {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      const response = request.data;
      console.log(response, "signup response");
      return response;
    } catch (error: any) {
      console.log(error, "signup error");
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Signup Failed");
    }
  }
);

// Async Login Thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (obj: any, thunkAPI) => {
    try {  
      const request = await axios.post(`${BACKEND_API}auth/login`, obj,  {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      const response = request.data;
      console.log(response, "login response");

      if( response?.status === false )
      {
        return null;
      }else{
      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(response));
      return response;
      }
    } catch (error: any) {
      console.log(error, "login error");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Logout action
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        if (action.error.message === "Request failed with Status code 401") {
          state.error = "Access Denied! Invalid User or Password";
        } else {
          state.error = action.payload as string;
        }
      });

    // Signup
    builder
      .addCase(userSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
        state.error = null;
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions; // ✅ Export logout

export default userSlice.reducer;
