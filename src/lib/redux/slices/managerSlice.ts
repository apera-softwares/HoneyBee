
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";



// fetch override earnings
export const fetchOverrideEarnings = createAsyncThunk(
  "manager/fetchOverrideEarnings",
  async (_: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.get(
        `${BACKEND_API}`,
        {
          headers: { Authorization: `Bearer ${token}`, 
          'ngrok-skip-browser-warning': 'true', },
          
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch override earnings"
      );
    }
  }
);

// fetch team performance
export const fetchTeamPerformance = createAsyncThunk(
  "manager/fetchTeamPerformance",
  async (_: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.get(
        `${BACKEND_API}`,
        {
          headers: { Authorization: `Bearer ${token}`,  
          'ngrok-skip-browser-warning': 'true', },
          
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch team performance"
      );
    }
  }
);

// fetch benefit allocation summary
export const fetchBenefitAllocationSummary = createAsyncThunk(
  "manager/fetchBenefitAllocationSummary",
  async (_: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.get(
        `${BACKEND_API}`,
        {
          headers: { Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true', },
          
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch benefit allocation summary"
      );
    }
  }
);




interface ManagerSliceState {
  overrideEarnings:any[];
  teamPerformance:any[];
  benefitAllocationSummary:any[];
  loading: boolean;
  error: string | null;
}

const initialState: ManagerSliceState = {
  overrideEarnings:[],
  teamPerformance:[],
  benefitAllocationSummary:[],
  loading: false,
  error: null,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // fetch override earnings
    builder
      .addCase(fetchOverrideEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverrideEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.overrideEarnings = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchOverrideEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetch team performance
    builder
      .addCase(fetchTeamPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.teamPerformance = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchTeamPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch
    builder
      .addCase(fetchBenefitAllocationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenefitAllocationSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.benefitAllocationSummary = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchBenefitAllocationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export default managerSlice.reducer;
