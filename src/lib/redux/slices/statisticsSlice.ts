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
      
      return response.data;


      // return {
      //   leadStatusNumberMonthly:[{status:"pending",count:10},{status:"pitched",count:15},{status:"sold",count:30},{status:"payout",count:40}],
      //   leadStatusNumberLifetime:[{status:"pending",count:100},{status:"pitched",count:150},{status:"sold",count:80},{status:"payout",count:200}],
      //   leadsByMonth:[{month:"Jan",count:5},{month:"Feb",count:10},{month:"Mar",count:20},{month:"Apr",count:10},{month:"May",count:15},{month:"Jun",count:25},{month:"Jul",count:10}],
      //   leadsByLifetime:[{year:"2021",count:100},{year:"2022",count:150},{year:"2023",count:200},{year:"2024",count:100},{year:"2025",count:80}],
      // }
      // return {
      //   leadStatusNumberMonthly:[],
      //   leadStatusNumberLifetime:[],
      //   leadsByMonth:[],
      //   leadsByLifetime:[],
      // }
    
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch statistics number"
      );
    }
  }
);

interface PieChartItem {
  label: string;
  count: number;
}
interface LineChartItem {
  label: string;
  count: number;
}

interface StatisticsState {
  pieChart: {
    monthly:PieChartItem[];
    lifetime:PieChartItem[];
  };
  lineChart:{
    monthly:LineChartItem[];
    lifetime:LineChartItem[];
  }
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  pieChart: {
    monthly:[],
    lifetime:[],
  },
  lineChart:{
    monthly:[],
    lifetime:[],
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
        const data = action.payload;
        state.loading = false;
        state.lineChart.monthly = data?.leadsByMonth?.map((item:any)=>({label:item?.month?.slice(0,3),count:item?.count}))||[];
        state.lineChart.lifetime = data?.leadsByLifeTime?.map((item:any)=>({label:item?.year_number,count:item?.count}))||[];
        state.pieChart.monthly = data?.leadStatusNumbers?.map((item:any)=>({label:item?.status,count:item?._count?.status}))||[];
        state.pieChart.lifetime = data?.leadsByMonthWithStatus?.map((item:any)=>({label:item?.status,count:item?.count}))||[];
      })
      .addCase(fetchStatisticsNumbers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statisticsSlice.reducer;
