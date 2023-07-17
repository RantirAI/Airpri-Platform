import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContainer from '../../components/layouts/AuthContainer'
import { useDispatch } from 'react-redux'
import { signIn } from '../../services/auth'
import { toast } from 'react-toastify'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await signIn({ email, password }, dispatch)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }

  }

  return (
    <AuthContainer title={'Sign into platform'}>
      <form onSubmit={handleSubmit}>

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

        <div className='mt-[23px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="password1"
              value="Password"
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

        <div className='mt-[23px] flex justify-between items-center'>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">
              Remember me
            </Label>
          </div>
          <Link className='text-[#1ABFAB] text-xs font-medium' to='/forgot-password'>
            Lost password?
          </Link>
        </div>

        <Button onClick={handleSubmit} type="submit" className='bg-[#1ABFAB] w-full mt-[23px]' size='xl' disabled={submitting} >
          {
            submitting ?
              <>
                <Spinner aria-label="Signing in" />
                <span className="pl-3">
                  Loading...
                </span>
              </>
              :
              'Sign in'
          }
        </Button>

        <div className='text-sm font-medium flex flex-row gap-1 mt-[23px]'>
          <p className='text-[#111928] dark:text-white'>
            Not registered?
          </p>
          <Link className='text-[#1ABFAB]' to='/create-account'>
            Create account
          </Link>
        </div>

      </form>
    </AuthContainer>
  )
}

export default SignIn