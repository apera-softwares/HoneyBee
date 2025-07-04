import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import userManagementReducer from './slices/userManagementSlice'
import productCatalogReducer from "./slices/productCatalogSlice";
import teamManagementReducer from './slices/teamManagementSlice';
import userProfileReducer from './slices/loginPersonProfile';
import memberReducer from './slices/memberSlice';
import referralReducer from "./slices/referralSlice";
import statisticsReducer from "./slices/statisticsSlice";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";


const rootReducer = combineReducers({
  app:appReducer,
  auth:authReducer,
  user: userReducer,
  userManagement: userManagementReducer,
  productCatalog:productCatalogReducer,
  teamManagement: teamManagementReducer,
  userProfile: userProfileReducer,
  member:memberReducer,
  referral:referralReducer,
  statistics:statisticsReducer,
})

export type RootReducer = ReturnType<typeof rootReducer> ;
export default rootReducer ;
