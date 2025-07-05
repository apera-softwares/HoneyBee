import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";


// signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.post(`${BACKEND_API}user/create`, payload, {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      return response.data;
    } catch (error: any) {
      console.log(error, "signup error");
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Account Creation failed. Please try again.");
    }
  }
);

// login
export const login = createAsyncThunk(
  "auth/login",
  async (payload: any, thunkAPI) => {
    try {  
      const response = await axios.post(`${BACKEND_API}auth/login`, payload,  {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });

      console.log(response, "login response");

      if( response?.data?.status === false )
      {
        return null;
      }else{
      //save to localStorage
      localStorage.setItem("user", JSON.stringify(response?.data));
      return response.data;
      }
    } catch (error: any) {
      console.log(error, "error while login");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to login");
    }
  }
);

// send otp
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(`${BACKEND_API}user/sendOtp`, data, {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send otp"
      );
    }
  }
);

//reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.put(`${BACKEND_API}user/restPassword`, data, {
        headers: { 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);






// get user from localStorage if exist
const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

interface AuthState {
  user:any|null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user:storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(login.fulfilled, (state,action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      });
    

    //send otp
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default authSlice.reducer;
