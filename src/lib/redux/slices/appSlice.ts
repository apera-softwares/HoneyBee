import { createSlice,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Fetch state and city
export const fetchStateAndCity = createAsyncThunk(
  "app/fetchStateAndCity",
  async (name:string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
  
      const response = await axios.get(
        `${BACKEND_API}user/getStateCity?name=${name}`,
        {
          headers: { Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true', }, 
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch states and city"
      );
    }
  }
);
// Fetch state and city
export const fetchStates = createAsyncThunk(
  "app/fetchStates",
  async (name:string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BACKEND_API}state?name=${name}`,
        {
          headers: {
          'ngrok-skip-browser-warning': 'true', }, 
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

interface AppState {
  pageTitle:string;
  loading:boolean;
  error:string|null;
}

const initialState: AppState = {
    pageTitle:"Dashboard",
    loading:false,
    error:"",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },

  },
    extraReducers: (builder) => {
    // Fetch state and city
    builder
      .addCase(fetchStateAndCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStateAndCity.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStateAndCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Fetch states
    builder
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },

});

export const {setPageTitle} = appSlice.actions;

export default appSlice.reducer;
