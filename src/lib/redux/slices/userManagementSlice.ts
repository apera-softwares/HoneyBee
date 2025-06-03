// src/redux/slices/userManagementSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token; 

        const {order,role,page,limit,name} = obj

        const response = await axios.get(`${BACKEND_API}admin/users?page=${page}&&role=${role}&&name=${name}&&order=${order}&&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}`, 
         'ngrok-skip-browser-warning': 'true',
       },
        });
  
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
      }
    }
  );

  export const CreateUser = createAsyncThunk(
    "user/Create",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
  
        const response = await axios.post(
          `${BACKEND_API}admin/user`,
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
          error.response?.data?.message || "Failed to Create user"
        );
      }
    }
  );

  export const UpdateUser = createAsyncThunk(
    "user/Update",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
        const { id, ...rest } = obj; 
  
        const response = await axios.put(
          `${BACKEND_API}admin/user/${id}`,
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
          error.response?.data?.message || "Failed to update user"
        );
      }
    }
  );
  

interface UserState {
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    //Get Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


      //Create User
      builder
      .addCase(CreateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(CreateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(CreateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      //Update User
      builder
      .addCase(UpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });



  },
});

export default userManagementSlice.reducer;
