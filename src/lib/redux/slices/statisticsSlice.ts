import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Fetch stat numbers
export const fetchStatisticsNumbers = createAsyncThunk(
  "statistics/fetchStatisticsNumbers",
  async (params: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.get(`${BACKEND_API}lead/numbers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const pieChartData = {
        labels: [] as string[],
        series: [] as number[],
      };
      const lineChartData = {
        categories: [] as string[],
        series: {
          name: "Lead",
          data: [] as number[],
        },
      };

      response?.data?.leadStatusNumbers?.forEach((item: any) => {
        pieChartData.labels.push(item?.status);
        const countValue = item?._count?.status;
        pieChartData.series.push(countValue);
      });
      response?.data?.leadsByMonth?.forEach((item: any) => {
        lineChartData?.categories.push(item?.month);
        const countValue = item?.count;
        lineChartData.series.data.push(countValue);
      });

      return {
        pieChartData,
        lineChartData,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stat numbers"
      );
    }
  }
);

interface StatisticsState {
  pieChartData: {
    labels: string[];
    series: number[];
  };
  lineChartData:{
    categories:string[],
    series:{
      name:string,
      data:number[],
    }
  }
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  pieChartData: {
    labels: [],
    series: [],
  },
  lineChartData:{
    categories:[],
    series:{
      name:"Lead",
      data:[],
    }
  },
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch  statistics numbers
    builder
      .addCase(fetchStatisticsNumbers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatisticsNumbers.fulfilled, (state, action) => {
        state.loading = false;
        state.pieChartData = action.payload.pieChartData;
        state.lineChartData = action.payload.lineChartData;
      })
      .addCase(fetchStatisticsNumbers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statisticsSlice.reducer;
