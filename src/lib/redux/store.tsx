import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import userManagementReducer from "./slices/userManagementSlice";
import productCatalogReducer from "./slices/productCatalogSlice";
import teamManagementReducer from "./slices/teamManagementSlice";
import userProfileReducer from "./slices/loginPersonProfile";
import memberManagementReducer from './slices/membersSlice';
import referralReducer from "./slices/referralSlice";
import statisticsReducer from "./slices/statisticsSlice";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app:appReducer,
      auth:authReducer,
      user: userReducer,
      UserManagement: userManagementReducer,
      productCatalog: productCatalogReducer,
      TeamManagement: teamManagementReducer,
      userProfile: userProfileReducer,
      memberManagement: memberManagementReducer,
      referral:referralReducer,
      statistic:statisticsReducer,
    },
  });
};

// Create the store instance (optional: used outside of SSR)
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
