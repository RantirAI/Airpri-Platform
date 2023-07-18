import Axios from '../config/axios'

export const createWorkspace = async (data) => {
    try {
        const response = await Axios.post('workspace', data)
        return response.data.workspace
    } catch (error) {
        throw new Error(error)
    }
}

export const editWorkspace = async (data, id) => {
    try {
        const response = await Axios.put(`workspace/${id}`, data)
        return response.data.workspace
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteWorkspace = async (id) => {
    try {
        await Axios.delete(`workspace/${id}`)
    } catch (error) {
        throw new Error(error)
    }
}

export const archiveWorkspace = async (id) => {
    try {
        await Axios.patch(`workspace/${id}`)
    } catch (error) {
        throw new Error(error)
    }
}