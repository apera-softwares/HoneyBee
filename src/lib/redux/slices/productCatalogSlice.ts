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

      queryParams.append("order","desc");

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

//fetch B_TEAM user selected products
export const fetchSelectedProducts = createAsyncThunk(
  "productCatalog/fetchSelectedProducts",
  async (userId: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.get(
        `${BACKEND_API}product/getProductByUserId/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}`,  
          'ngrok-skip-browser-warning': 'true', },  
        }
      );


      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch selected products"
      );
    }
  }
);

// Update Product
export const updateProductCatalog = createAsyncThunk(
  "productCatalog/updateProductCatalog",
  async ({ id, data }: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.put(`${BACKEND_API}product/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true', },
      });
      return response.data;
    } catch (error: any) {
      console.log(error,"product error")
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

      await axios.delete(`${BACKEND_API}product/${id}`, {
        headers: { Authorization: `Bearer ${token}`,   'ngrok-skip-browser-warning': 'true', },
      });

      return id ; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product catalog"
      );
    }
  }
);

//Select product
export const selectProductCatalog = createAsyncThunk(
  "productCatalog/selectProductCatalog",
  async (payload: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.post(`${BACKEND_API}product/assignMember`,payload, {
        headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true', },
      });
      return response.data;
    } catch (error: any) {
      console.log(error,"error while selecting product");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to select product"
      );
    }
  }
);

//Unselect product
export const unselectProductCatalog = createAsyncThunk(
  "productCatalog/unselectProductCatalog",
  async (payload: any, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.user?.user?.token;

      const response = await axios.delete(`${BACKEND_API}product/removeMember`, {
        headers: { Authorization: `Bearer ${token}`,  'ngrok-skip-browser-warning': 'true', },
        data:payload,
      });
      return response.data;
    } catch (error: any) {
      console.log(error,"error while unselecting product");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to unselect product"
      );
    }
  }
);


interface ProductCatalogState {
  productCatalogs: any[];
  selectedProducts:any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductCatalogState = {
  productCatalogs: [],
  selectedProducts:[],
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

    // Fetch products catalog
    builder
      .addCase(fetchProductCatalogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductCatalogs.fulfilled, (state, action) => {
        state.loading = false;
        state.productCatalogs = action.payload.data;
      })
      .addCase(fetchProductCatalogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch B_TEAM user selected products
    builder
      .addCase(fetchSelectedProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSelectedProducts.fulfilled, (state, action) => {
        state.selectedProducts = action.payload.data;
      })
      .addCase(fetchSelectedProducts.rejected, (state, action) => {
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

      //select product for   B_TEAM
    builder
      .addCase(selectProductCatalog.pending, (state) => {
        state.error = null;
      })
      .addCase(selectProductCatalog.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(selectProductCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      //unselect product of B_TEAM
    builder
      .addCase(unselectProductCatalog.pending, (state) => {
        state.error = null;
      })
      .addCase(unselectProductCatalog.fulfilled, (state) => {
        state.loading = false;
        //refetch data on UI side
      })
      .addCase(unselectProductCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productCatalogSlice.reducer;
