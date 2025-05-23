import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_API } from "@/api";

// Create Product
export const createProductCatalog = createAsyncThunk(
  "productCatalog/createProductCatalog",
  async (data: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
      const response = await axios.post(`${BACKEND_API}product`, data, {
        headers: { Authorization: `Bearer ${token}`, 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create product catalog"
      );
    }
  }
);

// Fetch Product Catalogs with filters (pagination, sorting, search)
export const fetchProductCatalogs = createAsyncThunk(
  "productCatalog/fetchProductCatalogs",
  async (params: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;
   
      const {page,limit,searchQuery,status}= params;
    
      const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
      });

      if (searchQuery) {
      queryParams.append("name", searchQuery);
      }

      if (status === "true" || status === "false") {
      queryParams.append("status", status);
      }

      const response = await axios.get(
        `${BACKEND_API}admin/products?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
          
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product catalogs"
      );
    }
  }
);

// Update Product
export const updateProductCatalog = createAsyncThunk(
  "productCatalog/updateProductCatalog",
  async ({ id, ...data }: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.put(`${BACKEND_API}product/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true', },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update product catalog"
      );
    }
  }
);

// Delete Product
export const deleteProductCatalog = createAsyncThunk(
  "productCatalog/deleteProductCatalog",
  async (id: string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.delete(`${BACKEND_API}product/${id}`, {
        headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
      });
      console.log(response,"delete response")

      return id ; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product catalog"
      );
    }
  }
);


interface ProductCatalogState {
  productCatalogs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductCatalogState = {
  productCatalogs: [],
  loading: false,
  error: null,
};

const productCatalogSlice = createSlice({
  name: "productCatalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createProductCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductCatalog.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(createProductCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch
    builder
      .addCase(fetchProductCatalogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductCatalogs.fulfilled, (state, action) => {
        state.loading = false;
        state.productCatalogs = action.payload.data || [];
      })
      .addCase(fetchProductCatalogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update
    builder
      .addCase(updateProductCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductCatalog.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(updateProductCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteProductCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductCatalog.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(deleteProductCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productCatalogSlice.reducer;
