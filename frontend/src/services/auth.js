import Axios, { setAxiosToken } from "../config/axios"
import jwtDecode from "jwt-decode"
import { authenticate } from "../redux/features/authSlice"

export const signIn = async (data, dispatch) => {
    try {
        const response = await Axios.post('sign-in', data)
        const token = response.data.token
        const user = jwtDecode(token)
        setAxiosToken(token)
        dispatch(authenticate(user))
        localStorage.removeItem('token')
        localStorage.setItem('token', token)
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message)
    }
}

export const createAccount = async (data, dispatch) => {
    try {
        const response = await Axios.post('create-account', data)
        const token = response.data.token
        const user = jwtDecode(token)
        setAxiosToken(token)
        dispatch(authenticate(user))
        localStorage.removeItem('token')
        localStorage.setItem('token', token)
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message)
    }
}

export const requestPasswordReset = async (email) => {
    try {
        await Axios.post('request-password-reset', {email})
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message)
    }
}

export const resetPassword = async (data) => {
    try {
        await Axios.patch('reset-password', data)
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message)
    }
}