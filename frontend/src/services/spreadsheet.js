import Axios from "../config/axios"

export const createSpreadsheet = async (data) => {
    try {
        const response = await Axios.post('spreadsheet', data)
        return response.data.spreadsheet
    } catch (error) {
        throw new Error(error)
    }
}

export const editSpreadsheet = async (data, id) => {
    try {
        const response = await Axios.put(`spreadsheet/${id}`, data)
        return response.data.spreadsheet
    } catch (error) {
        throw new Error(error)
    }
}