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

// Fetch Product Catalogs with filters (pagination, sorting, search)
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (obj: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
   
      const {page,limit}= obj;
    
    
      const response = await axios.get(
        `${BACKEND_API}team/members?limit=${limit}&&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
          
        }
      );


      console.log(response.data,"team memerss")
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch Members"
      );
    }
  }
);

// Update Product
// export const updateProductCatalog = createAsyncThunk(
//   "productCatalog/updateProductCatalog",
//   async ({ id, ...data }: any, thunkAPI) => {
//     try {
//       const state: any = thunkAPI.getState();
//       const token = state.user?.user?.token;

//       const response = await axios.put(`${BACKEND_API}product/${id}`, data, {
//         headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true', },
//       });

//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to update product catalog"
//       );
//     }
//   }
// );

// Delete Product
// export const deleteProductCatalog = createAsyncThunk(
//   "productCatalog/deleteProductCatalog",
//   async (id: string, thunkAPI) => {
//     try {
//       const state: any = thunkAPI.getState();
//       const token = state.user?.user?.token;

//       const response = await axios.delete(`${BACKEND_API}product/${id}`, {
//         headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
//       });
//       console.log(response,"delete response")

//       return id ; 
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to delete product catalog"
//       );
//     }
//   }
// );


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

    // Fetch
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data || [];
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  
   
  },
});

export default memberManagementSlice.reducer;
