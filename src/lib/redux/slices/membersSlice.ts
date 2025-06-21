import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Create Product
export const createMember = createAsyncThunk(
  "member/createMeber",
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
  "members/fetchAssignedMembers",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const {page,limit, name}= obj;
      const response = await axios.get(
        `${BACKEND_API}product/getMemberProductMemberCreatedByUser?name=${name}&&limit=${limit}&&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
        }
      );
      console.log(response.data,"assigend members")
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to assigned Members"
      );
    }
  }
);

  export const deleteAssignedMemberProduct = createAsyncThunk(
  "member/memberProductDelete",
  async (id: any, thunkAPI) => {
    console.log(id, "delete id");
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



interface ProductCatalogState {
  members: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductCatalogState = {
  members: [],
  loading: false,
  error: null,
};

const memberManagementSlice = createSlice({
  name: "memberManagement",
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

export default memberManagementSlice.reducer;
