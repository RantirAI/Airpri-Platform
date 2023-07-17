import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import workspaceReducer from './features/workspaceSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer
    }
})

export default store