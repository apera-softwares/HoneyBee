import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

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







interface AuthState {
  user:any|null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user:null,
  loading: false,
  error: null,
};

const productCatalogSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    

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

export default productCatalogSlice.reducer;
