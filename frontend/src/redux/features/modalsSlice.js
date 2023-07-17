import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showNewWorkspaceModal: false,
    showDeleteWorkspaceModal: false,
    showArchiveWorkspaceModal: false
}

const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        toggleNewWorkspaceModal: (state, action) => {
            state.showNewWorkspaceModal = action.payload
        },
        toggleDeleteWorkspaceModal: (state, action) => {
            state.showDeleteWorkspaceModal = action.payload
        },
        toggleArchiveWorkspaceModal: (state, action) => {
            state.showArchiveWorkspaceModal = action.payload
        },
    }
})
export const { toggleNewWorkspaceModal, toggleDeleteWorkspaceModal, toggleArchiveWorkspaceModal } = modalsSlice.actions
export default modalsSlice.reducer