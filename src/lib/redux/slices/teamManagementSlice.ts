import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

export const fetchTeams = createAsyncThunk(
  "teamManagement/fetchTeams",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const { page,limit,name } = obj;

      const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
      });

      if (name) {
      queryParams.append("name",name);
      }

      const response = await axios.get(
        `${BACKEND_API}team?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch Teams"
      );
    }
  }
);
export const fetchTeamsByUserId = createAsyncThunk(
  "teamManagement/fetchTeamsByUserId",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const id = state.user?.user?.userId;
      const { page, limit } = obj;

      const response = await axios.get(
        `${BACKEND_API}team/getTeamByUserId/${id}?page=${page}&&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const allTeams = response.data?.data || [];

      //Filter only teams where l1ManagerId !== userId
      // const filteredTeams = allTeams.filter(
      //   (team: any) => team.l1ManagerId !== id
      // );

      // return filteredTeams;
      return allTeams
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch Teams"
      );
    }
  }
);

export const fetchTeamMembers = createAsyncThunk(
  "teamManagement/fetchTeamMembers",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const { page, limit, id, search } = obj;
      console.log(obj, "obj 2");
      const response = await axios.get(
        `${BACKEND_API}team/members/${id}?name=${search}&&page=${page}&&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch Team Members"
      );
    }
  }
);

export const createTeam = createAsyncThunk(
  "teamManagement/createTeam",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      console.log(obj, "create team and assign manage to team");

      const response = await axios.post(`${BACKEND_API}team`, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Create Team"
      );
    }
  }
);

export const updateTeam = createAsyncThunk(
  "teamManagement/updateTeam",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const { id, ...rest } = obj;

      const response = await axios.put(`${BACKEND_API}team/${id}`, rest, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update Team"
      );
    }
  }
);

export const changeTeam = createAsyncThunk(
  "teamManagement/changeTeam",
  async (payload: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.post(`${BACKEND_API}team/changeTeam`,payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to change team"
      );
    }
  }
);

export const addTeamMember = createAsyncThunk(
  "teamManagement/addTeamMember",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const { teamId, addUserId, page = 1, limit = 10 } = obj;

      const response = await axios.post(
        `${BACKEND_API}team/addMember`,
        {
          teamId,
          addUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
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
  "teamManagement/deleteTeamDelete",
  async (id: any, thunkAPI) => {
    console.log(id, "delete id");
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.delete(
        `${BACKEND_API}team/removeMember/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
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
  members: [],
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
        state.teams = action.payload?.data||[];
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //fetch teams by userId
    builder
      .addCase(fetchTeamsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(fetchTeamsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeamsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //Create Team

    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //Update Team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teams = [];
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //change team by B_TEAM user
    builder
      .addCase(changeTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeTeam.rejected, (state, action) => {
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
