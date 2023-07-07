import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContainer from '../../components/layouts/AuthContainer'
import { resetPassword } from '../../services/auth'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (password != confirmPassword) {
        console.log(password, confirmPassword)
        throw new Error('Passwords do not match!')
      }
      await resetPassword({ email, password, token })
      toast.success('Password successfully changed!')
      navigate('/sign-in')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }

  }

  return (
    <AuthContainer title={'Reset your password'}>
      <form onSubmit={handleSubmit}>

        <div className='mt-[18px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="email1"
              value="Email"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="email1"
            placeholder="name@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='mt-[18px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="password1"
              value="New Password"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="password1"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className='mt-[18px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="password1"
              value="Confirm New Password"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="password1"
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className='mt-[18px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="name1"
              value="Password Reset Token"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="name1"
            placeholder=""
            required
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <Button type="submit" className='bg-[#1ABFAB] w-full mt-[18px]' size='xl' onClick={handleSubmit} >
          {
            submitting ?
              <>
                <Spinner aria-label="Spinner button example" />
                <span className="pl-3">
                  Loading...
                </span>
              </>
              :
              'Change password'
          }
        </Button>

        <div className='text-sm font-medium flex flex-row gap-1 mt-[18px]'>
          <p className='text-[#111928] dark:text-white'>
            Don't have an account?
          </p>
          <Link className='text-[#1ABFAB]' to='/create-account'>
            Create Account
          </Link>
        </div>

      </form>
    </AuthContainer>
  )
}

export default ResetPassword