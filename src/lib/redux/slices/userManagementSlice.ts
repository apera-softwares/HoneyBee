
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

export const fetchUsers = createAsyncThunk(
    "userManagement/fetchUsers",
    async (obj: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token; 
        const {order,role,page,limit,name} = obj;
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        
        if(name){
          queryParams.append("name",name);
        }

        if(role){
          queryParams.append("role",role);
        }

        if(order){
          queryParams.append("order",order);
        }


        const response = await axios.get(`${BACKEND_API}admin/users?${queryParams.toString()}`, {
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

  export const createUser = createAsyncThunk(
    "userManagement/createUser",
    async (payload: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
  
        const response = await axios.post(
          `${BACKEND_API}admin/user`,
          payload, 
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

  export const updateUser = createAsyncThunk(
    "userManagement/updateUser",
    async (payload: any, thunkAPI) => {
      try {
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
        const { id, ...restData } = payload; 
  
        const response = await axios.put(
          `${BACKEND_API}admin/user/${id}`,
          restData, 
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
        state.users = action.payload?.data||[];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


      //Create User
      builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      //Update User
      builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.users = [];
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });



  },
});

export default userManagementSlice.reducer;
