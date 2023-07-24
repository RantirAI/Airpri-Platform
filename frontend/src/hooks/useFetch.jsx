import React, { useEffect, useState } from 'react'
import Axios from '../config/axios'

const useFetch = (url, dependencies) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        (
            async () => {
                try {
                    setLoading(true)
                    const response = await Axios.get(url)
                    setData(response.data)
                } catch (error) {
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }
        )()
    }, [...dependencies])

    return {
        data,
        loading,
        error
    }
}

export default useFetch