import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import modalsReducer from './features/modalsSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        modals: modalsReducer
    }
})

export default store