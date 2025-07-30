import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Fetch stat numbers
export const fetchStatisticsNumbers = createAsyncThunk(
  "statistics/fetchStatisticsNumbers",
  async (_:void, thunkAPI) => {
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

export const fetchBenefitAllocationSummary = createAsyncThunk(
  "statistics/fetchBenefitAllocationSummary",
  async (_:void, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.get(
        `${BACKEND_API}lead/OverRideEarning`,
        {
          headers: { Authorization: `Bearer ${token}`, 
          'ngrok-skip-browser-warning': 'true', },
          
        }
      );
      return response.data?.data;

    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch override earnings"
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
  pieChartLeads: {
    weekly:PieChartItem[];
    monthly:PieChartItem[];
    querterly:PieChartItem[];
    yearly:PieChartItem[];
    lifetime:PieChartItem[];
    totalLeads:any
  };
  lineChartLeads:{
    weekly:LineChartItem[];
    monthly:LineChartItem[];
    quarterly:LineChartItem[];
    yearly:LineChartItem[];
    lifetime:LineChartItem[];
  };
  lineChartEarnings:{
    weekly:any[];
    monthly:any[];
    quarterly:any[];
    yearly:any[];
    lifetime:any[];
  };
  pieChartEarnings:{
    weekly:PieChartItem[];
    monthly:PieChartItem[];
    quarterly:PieChartItem[];
    yearly:PieChartItem[];
    lifetime:PieChartItem[];
    totalEarnings:any;
  };
  benefitAllocation:any[]
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  pieChartLeads: {
    weekly:[],
    monthly:[],
    querterly:[],
    yearly:[],
    lifetime:[],
    totalLeads:""
  },
  lineChartLeads:{
    weekly:[],
    monthly:[],
    quarterly:[],
    yearly:[],
    lifetime:[],
  },
  lineChartEarnings:{
    weekly:[],
    monthly:[],
    quarterly:[],
    yearly:[],
    lifetime:[],
  },
  pieChartEarnings:{
    weekly:[],
    monthly:[],
    quarterly:[],
    yearly:[],
    lifetime:[],
    totalEarnings:""
  },
  benefitAllocation:[],
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
        state.lineChartLeads.weekly = data?.leadByThisWeek?.map((item:any)=>({label:item?.week,count:item?.count}))||[];
        state.lineChartLeads.monthly = data?.leadsByDayMonth?.map((item:any)=>({label:item?.day_number,count:item?.count}))||[];
        state.lineChartLeads.quarterly = data?.leadByQuarter?.map((item:any)=>({label:item?.quarter,count:item?.count}))||[];
        state.lineChartLeads.yearly = data?.leadsByMonth?.map((item:any)=>({label:item?.month?.slice(0,3),count:item?.count}))||[];
        state.lineChartLeads.lifetime = data?.leadsByLifeTime?.map((item:any)=>({label:item?.year_number,count:item?.count}))||[];
        state.pieChartLeads.monthly = data?.leadsForMonthPerDayStatus?.map((item:any)=>({label:item?.status,count:item?.count}))||[];
        state.pieChartLeads.yearly = data?.leadsByMonthWithStatus?.map((item:any)=>({label:item?.status,count:item?.count}))||[];
        state.pieChartLeads.lifetime = data?.leadStatusNumbers?.map((item:any)=>({label:item?.status,count:item?._count?.status}))||[];
        state.pieChartLeads.totalLeads = data?.totalLeads;
        //lineChartEarnings
        state.lineChartEarnings.weekly = data?.leadAmountByWeek?.map((item:any)=>({count:item?.totalCommissionAmount}))||[];
        state.lineChartEarnings.monthly = data?.amountLeadsForMonthPerDay?.map((item:any)=>({count:item?.totalCommissionAmount}))||[];
        state.lineChartEarnings.quarterly = data?.leadAmountByQuarter?.map((item:any)=>({count:item?.totalCommissionAmount}))||[];
        state.lineChartEarnings.yearly = data?.leadAmountInMonths?.map((item:any)=>({count:item?.totalEarnings}))||[];
        state.lineChartEarnings.lifetime = data?.leadAmountByYear?.map((item:any)=>({count:item?.totalCommissionAmount}))||[];
        state.pieChartEarnings.monthly = data?.amountLeadsForMonthPerDayStatus?.map((item:any)=>({label:item?.status,count:item?.totalCommissionAmount}))||[];
        state.pieChartEarnings.yearly = data?.leadAmountByYearByStatus?.map((item:any)=>({label:item?.status,count:item?.totalCommissionAmount}))||[];
        state.pieChartEarnings.lifetime = data?.leadAmountByStatus?.map((item:any)=>({label:item?.status,count:item?.totalCommissionAmount}))||[];
        state.pieChartEarnings.totalEarnings = data?.totalEarnings||0;
      })
      .addCase(fetchStatisticsNumbers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch  benifit allocation
    builder
      .addCase(fetchBenefitAllocationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenefitAllocationSummary.fulfilled, (state, action) => {
        const data = action.payload;
        state.loading = false;
        state.benefitAllocation = data?.sumEntries?.map((item:any)=>({label:item?.name,count:item?.amount}))||[];
      })
      .addCase(fetchBenefitAllocationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statisticsSlice.reducer;
