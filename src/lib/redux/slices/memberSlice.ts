import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Create Product
export const createMember = createAsyncThunk(
  "member/createMember",
  async (data: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.post(`${BACKEND_API}product/assignMember`, data, {
        headers: { Authorization: `Bearer ${token}`,
       'ngrok-skip-browser-warning': 'true',
     },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create Member"
      );
    }
  }
);

// Fetch Assigned Memebrs
export const fetchAssignedMembers = createAsyncThunk(
  "member/fetchAssignedMembers",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const {page,limit, name, order}= obj;

      const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
      });

      if(name){
        queryParams.append("name",name);
      }

      if(order){
        queryParams.append("order",order);
      }

      const response = await axios.get(
        `${BACKEND_API}product/getMemberProductMemberCreatedByUser?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to assigned Members"
      );
    }
  }
);

  export const deleteAssignedMemberProduct = createAsyncThunk(
  "member/deleteAssignedMemberProduct",
  async (id: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.delete(
        `${BACKEND_API}product/removeMember`,
        {
          data: { memberProductId: id },
          headers: {
            Authorization: `Bearer ${token}`,
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



interface MemberState {
  members: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Assigned Members
    builder
      .addCase(fetchAssignedMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data || [];
      })
      .addCase(fetchAssignedMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      // Delete Assigned Members
    builder
      .addCase(deleteAssignedMemberProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignedMemberProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data || [];
      })
      .addCase(deleteAssignedMemberProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  
   
  },
});

export default memberSlice.reducer;
