import Axios from "../config/axios"

export const shareSpreadsheet = async (id, data) => {
    try {
        const response = await Axios.post(`share/spreadsheet/${id}`, data)
        return response.data.spreadsheetId
    } catch (error) {
        throw new Error(error)
    }
}

export const shareWorkspace = async (id, data) => {
    try {
        const response = await Axios.post(`share/workspace/${id}`, data)
        return response.data.workspaceId
    } catch (error) {
        throw new Error(error)
    }
}

export const inviteMember = async (id, data) => {
    try {
        const response = await Axios.post(`share/workspace/${id}`, data)
        return response.data.workspaceId
    } catch (error) {
        throw new Error(error)
    }
}