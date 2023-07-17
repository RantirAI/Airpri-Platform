import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import workspaceReducer from './features/workspaceSlice'
import modalsReducer from './features/modalsSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        modals: modalsReducer
    }
})

export default store