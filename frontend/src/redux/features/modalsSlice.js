import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showNewWorkspaceModal: false,
    showDeleteWorkspaceModal: false,
    showArchiveWorkspaceModal: false,
    showDuplicateWorkspaceModal: false,
    showWorkspaceSettingsModal: false
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
        toggleDuplicateWorkspaceModal: (state, action) => {
            state.showDuplicateWorkspaceModal = action.payload
        },
        toggleWorkspaceSettingsModal: (state, action) => {
            state.showWorkspaceSettingsModal = action.payload
        },
    }
})
export const { toggleNewWorkspaceModal, toggleDeleteWorkspaceModal, toggleArchiveWorkspaceModal, toggleDuplicateWorkspaceModal, toggleWorkspaceSettingsModal } = modalsSlice.actions
export default modalsSlice.reducer