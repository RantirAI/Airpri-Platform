import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContainer from '../../components/layouts/AuthContainer'
import { requestPasswordReset } from '../../services/auth'

const ForgotPassword = () => {

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await requestPasswordReset(email)
      toast.success('Password reset token sent to your mail!')
      navigate('/reset-password')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthContainer title={'Forgot your password?'}>
      <form onSubmit={handleSubmit}>

        <p className='text-base font-normal text-gray-500 dark:text-gray-400 mt-[23px]'>
          Don't fret! Just type in your email and we will send you a code to reset your password!
        </p>

        <div className='mt-[23px]'>
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

        <Button type="submit" className='bg-[#1ABFAB] w-full mt-[23px]' size='xl' disabled={submitting} onClick={handleSubmit} >
          {
            submitting ?
              <>
                <Spinner aria-label="Resetting password" />
                <span className="pl-3">
                  Loading...
                </span>
              </>
              :
              'Reset password'
          }
        </Button>

        <div className='text-sm font-medium flex flex-row gap-1 mt-[23px]'>
          <p className='text-[#111928] dark:text-white'>
            Remember password?
          </p>
          <Link className='text-[#1ABFAB]' to='/sign-in'>
            Sign in
          </Link>
        </div>
        <div className='text-sm font-medium flex flex-row gap-1 mt-[13px]'>
          <p className='text-[#111928] dark:text-white'>
            Don't have an account?
          </p>
          <Link className='text-[#1ABFAB]' to='/create-account'>
            Create account
          </Link>
        </div>

      </form>
    </AuthContainer>
  )
}

export default ForgotPassword