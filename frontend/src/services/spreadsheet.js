import Axios from "../config/axios"

export const createSpreadsheet = async (data) => {
    try {
        const response = await Axios.post('spreadsheet', data)
        return response.data.spreadsheet
    } catch (error) {
        throw new Error(error)
    }
}