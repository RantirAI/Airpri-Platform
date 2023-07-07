import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, action) => {
            state.user = action.payload
            state.loading = false
        },
        signOut: (state) => {
            state.user = null
            state.loading = false
        }
    }
})
export const { authenticate, signOut } = authSlice.actions
export default authSlice.reducer