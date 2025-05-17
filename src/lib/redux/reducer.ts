import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import userManagementReducer from './slices/userManagementSlice'
import teamManageMentReducer from './slices/TeamManagementSlice'


const rootReducer = combineReducers({
  user: userReducer,
  userManagement: userManagementReducer,
  teamManagement: teamManageMentReducer
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
