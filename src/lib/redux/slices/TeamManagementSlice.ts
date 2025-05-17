import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

export const fetchTeams = createAsyncThunk(
    "user/fetchTeams",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token; 
        const {page,limit} = obj

        const response = await axios.get(`${BACKEND_API}team?page=${page}&&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch Teams");
      }
    }
  );

  export const CreateTeam = createAsyncThunk(
    "team/Create",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
        const { id, ...rest } = obj;
  
        const response = await axios.post(
          `${BACKEND_API}team`,
          rest, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to Create Team"
        );
      }
    }
  );

  export const UpdateTeam = createAsyncThunk(
    "team/Update",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
        const { id, ...rest } = obj; 
  
        const response = await axios.put(
          `${BACKEND_API}team/${id}`,
          rest, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to update Team"
        );
      }
    }
  );
  

interface TeamState {
  teams: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
};

const teamManagementSlice = createSlice({
  name: "TeamManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    //Get Teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


      //Create Team

      builder
      .addCase(CreateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(CreateTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(CreateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      //Update Team
      builder
      .addCase(UpdateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(UpdateTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(UpdateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });



  },
});

export default teamManagementSlice.reducer;
