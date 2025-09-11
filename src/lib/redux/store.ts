import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
//import storage from "redux-persist/lib/storage"; // defaults to localStorage
import storage from "@/utils/storage";
import userReducer from "./slices/userSlice";
import userManagementReducer from "./slices/userManagementSlice";
import productCatalogReducer from "./slices/productCatalogSlice";
import teamManagementReducer from "./slices/teamManagementSlice";
import userProfileReducer from "./slices/loginPersonProfile";
import memberReducer from "./slices/memberSlice";
import referralReducer from "./slices/referralSlice";
import statisticsReducer from "./slices/statisticsSlice";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  userManagement: userManagementReducer,
  productCatalog: productCatalogReducer,
  teamManagement: teamManagementReducer,
  userProfile: userProfileReducer,
  member: memberReducer,
  referral: referralReducer,
  statistics: statisticsReducer,
});

// persist only the `app` slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["app"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
