import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

export const fetchTeams = createAsyncThunk(
    "team/fetchTeams",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token; 
        const {page,limit} = obj

        const response = await axios.get(`${BACKEND_API}team?page=${page}&&limit=${limit}`,  {
          headers: { Authorization: `Bearer ${token}`, 
         'ngrok-skip-browser-warning': 'true',
       },
        });
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch Teams");
      }
    }
  );

  export const fetchTeamMembers = createAsyncThunk(
    "team/fetchTeamMembers",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token; 
        const {page,limit, id, search} = obj
        const response = await axios.get(`${BACKEND_API}team/members/${id}?name=${search}&&page=${page}&&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}`, 
         'ngrok-skip-browser-warning': 'true',
       },
        });
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch Team Members");
      }
    }
  );

  export const CreateTeam = createAsyncThunk(
    "team/Create",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
  
        const response = await axios.post(
          `${BACKEND_API}team`,
          obj, 
          {
            headers: { Authorization: `Bearer ${token}`, 
           'ngrok-skip-browser-warning': 'true',
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
            headers: { Authorization: `Bearer ${token}`, 
           'ngrok-skip-browser-warning': 'true',
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
  
  export const addTeamMember = createAsyncThunk(
    "add/teamMember",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
        const { teamId, addUserId, page = 1, limit = 10 } = obj;
  
        const response = await axios.post(
          `${BACKEND_API}team/addMember`,
          {
            teamId,
            addUserId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
  
        // ✅ Trigger fetchTeamMembers after adding successfully
        thunkAPI.dispatch(fetchTeamMembers({ id: teamId, page, limit }));
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to Add Team Member"
        );
      }
    }
  );
  

  export const deleteTeamMember = createAsyncThunk(
    "team/memberDelete",
    async (id: any, thunkAPI) => {
      console.log(id,"delete id")
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
  
        const response = await axios.delete(
          `${BACKEND_API}team/removeMember/${id}`,
          {
            headers: { Authorization: `Bearer ${token}`, 
           'ngrok-skip-browser-warning': 'true',
         },
          }
        );
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to Delete Member"
        );
      }
    }
  );
  

interface TeamState {
  teams: any[];
  members: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  members:[],
  loading: false,
  error: null,
};

const teamManagementSlice = createSlice({
  name: "teamManagement",
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

       //Get Team Memebrs
       builder
       .addCase(fetchTeamMembers.pending, (state) => {
         state.loading = true;
         state.error = null;
         state.members = [];
       })
       .addCase(fetchTeamMembers.fulfilled, (state, action) => {
         state.loading = false;
         state.members = action.payload;
       })
       .addCase(fetchTeamMembers.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload as string;
       });


         //Add Team Memebr
         builder
         .addCase(addTeamMember.pending, (state) => {
          state.loading = true;
          state.error = null;
          // ✅ Don't reset teams here
        })
        
         .addCase(addTeamMember.fulfilled, (state, action) => {
           state.loading = false;
           state.members = action.payload;
         })
         .addCase(addTeamMember.rejected, (state, action) => {
           state.loading = false;
           state.error = action.payload as string;
         });


            //Delete Team Memebr
            builder
            .addCase(deleteTeamMember.pending, (state) => {
              state.loading = true;
              state.error = null;
              state.members = [];
            })
            .addCase(deleteTeamMember.fulfilled, (state, action) => {
              state.loading = false;
              state.members = action.payload;
            })
            .addCase(deleteTeamMember.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
            });


  },
});

export default teamManagementSlice.reducer;
