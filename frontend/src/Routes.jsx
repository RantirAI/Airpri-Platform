import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CreateAccount from './pages/auth/CreateAccount'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import SignIn from './pages/auth/SignIn'
import Dashboard from './pages/main/Dashboard'
import NotFound from './pages/NotFound'

const index = () => {
    const { user } = useSelector(state => state.auth)
    return (
        <BrowserRouter>
            <Routes>
                {
                    user ?
                        <>
                            <Route path='/sign-in' element={<Navigate replace to={'/dashboard'} />} />
                            <Route path='/create-account' element={<Navigate replace to={'dashboard'} />} />
                            <Route path='/' element={<Navigate replace to={'/dashboard'} />} />
                            <Route path='/dashboard' element={<Dashboard />} />
                        </>
                        :
                        <>
                            <Route path='/'  element={<Navigate replace to={'/sign-in'} />} />
                            <Route path='/sign-in' element={<SignIn />} />
                            <Route path='/create-account' element={<CreateAccount/>} />
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