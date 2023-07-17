import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workspace: null
}

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        selectWorkspace: (state, action) => {
            state.workspace = action.payload
        },
        unselectWorkspace: (state) => {
            state.workspace = null
        }
    }
})
export const { selectWorkspace, unselectWorkspace } = workspaceSlice.actions
export default workspaceSlice.reducer