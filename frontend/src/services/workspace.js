import Axios from '../config/axios'

export const createWorkspace = async (data) => {
    try {
        const response = await Axios.post('workspace', data)
        return response.data.workspace
    } catch (error) {
        throw new Error(error)
    }
}

