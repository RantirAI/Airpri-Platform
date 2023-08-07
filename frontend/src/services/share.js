import Axios from "../config/axios"

export const shareSpreadsheet = async (id, data) => {
    try {
        const response = await Axios.post(`share/spreadsheet/${id}`, data)
        return response.data.spreadsheetId
    } catch (error) {
        throw new Error(error)
    }
}