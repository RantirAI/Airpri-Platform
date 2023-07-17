import Axios from "../config/axios"

export const getOrgMembers = async () => {
    try {
        const response = await Axios.get('org-members')
        return response.data.members
    } catch (error) {
        throw new Error(error)
    }
}