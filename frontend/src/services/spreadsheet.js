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

export const deleteSpreadsheet = async (id) => {
    try {
        await Axios.delete(`spreadsheet/${id}`)
    } catch (error) {
        throw new Error(error)
    }
}

export const archiveSpreadsheet = async (id) => {
    try{
        await Axios.patch(`spreadsheet/${id}`)
    } catch(error) {
        throw new Error(error)
    }
}

export const importCsv = async (data, id) => {
    try {
        const response = await Axios.post(`spreadsheet/import-csv/${id}`, data)
        return response.data.spreadsheet
    } catch (error) {
        throw new Error(error)
    }
}