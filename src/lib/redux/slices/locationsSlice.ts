import { BACKEND_API } from "@/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async get UserProfile Thunk
export const getCityAndState = createAsyncThunk(
  "user/getCityAndState",
  async (obj:any,thunkAPI) => {
 
    try {  
           const {name} = obj
        const state: any = thunkAPI.getState();
        const token = state.user?.user?.token;
      const request = await axios.get(`${BACKEND_API}user/getStateCity?name=${name}`,  {
        headers: { 
            Authorization: `Bearer ${token}`, 
       'ngrok-skip-browser-warning': 'true',
     },
      });
      const response = request.data.user;
      console.log(response, "city and state response");

      return response;
    } catch (error: any) {
      console.log(error, "User Profile error");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "get city and state failed");
    }
  }
);


interface UserState {
  cityState: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  cityState:[] ,
  loading: false,
  error: null,
};


const cityStateSlice = createSlice({
  name: "cityState",
  initialState,
  reducers: {

   
    
  },
  extraReducers: (builder) => {
    // get City and State
    builder
      .addCase(getCityAndState.pending, (state) => {
        state.loading = true;
        state.cityState = null;
        state.error = null;
      })
      .addCase(getCityAndState.fulfilled, (state, action) => {
        state.loading = false;
        state.cityState = action.payload;
        state.error = null;
      })
      .addCase(getCityAndState.rejected, (state, action) => {
        state.loading = false;
        state.cityState = null;
        if (action.error.message === "Request failed with Status code 401") {
          state.error = "Access Denied!";
        } else {
          state.error = action.payload as string;
        }
      });
    }
   
});

export default cityStateSlice.reducer;
