import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CreateAccount from './pages/auth/CreateAccount'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import SignIn from './pages/auth/SignIn'
import Dashboard from './pages/main/Dashboard'
import NotFound from './pages/NotFound'
import { useLayoutEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { authenticate } from './redux/features/authSlice';
import { setAxiosToken } from './config/axios'
import Workspace from './pages/main/Workspace'
import Spreadsheets from './pages/main/Spreadsheets'
import Spreadsheet from './pages/main/Spreadsheet'

const index = () => {

    const { user, loading } = useSelector((state) => state.auth)
    const { workspace } = useSelector(state => state.workspace)


    const dispatch = useDispatch()

    useLayoutEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwtDecode(token)
            if (user) {
                setAxiosToken(token)
                dispatch(authenticate(user))
            }
        } else {
            dispatch(authenticate(null))
        }
    }, [])


    if (loading) {
        return <div>
            Loading...
        </div>
    }

    return (
        <BrowserRouter>
            <Routes>
                {
                    user ?
                        <>
                            <Route path='/sign-in' element={<Navigate replace to={'/dashboard'} />} />
                            <Route path='/create-account' element={<Navigate replace to={'/dashboard'} />} />
                            <Route path='/' element={<Navigate replace to={'/dashboard'} />} />
                            <Route path='/dashboard' element={<Dashboard />} />
                            <>
                                {
                                    workspace ?
                                        <>
                                            <Route path='/workspace' element={<Workspace />} />
                                            <Route path='/spreadsheet' element={<Spreadsheets />} />
                                            <Route path='/spreadsheet/:id' element={<Spreadsheet />} />
                                        </>
                                        :
                                        <>
                                            <Route path='*' element={<Navigate replace to={'/dashboard'} />} />
                                        </>

                                }
                            </>
                        </>
                        :
                        <>
                            <Route path='/' element={<Navigate replace to={'/sign-in'} />} />
                            <Route path='/dashboard' element={<Navigate replace to={'/sign-in'} />} />
                            <Route path='/sign-in' element={<SignIn />} />
                            <Route path='/create-account' element={<CreateAccount />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />
                            <Route path='/reset-password' element={<ResetPassword />} />
                        </>
                }
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default index