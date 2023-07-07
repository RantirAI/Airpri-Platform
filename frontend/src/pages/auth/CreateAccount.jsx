import { Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthContainer from '../../components/layouts/AuthContainer'
import { createAccount } from '../../services/auth'

const CreateAccount = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [termsAndConditionsAgreed, setTermsAndConditionsAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if(!password != confirmPassword){
        throw new Error('Passwords do not match!')
      }
      await createAccount({ email, password, orgName, termsAndConditionsAgreed }, dispatch)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }

  }


  return (
    <AuthContainer title={'Create your Free Account'}>
      <form>

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

        <div className='mt-[18px]'>
          <div className="mb-2 block">
            <Label
              htmlFor="password2"
              value="Confirm Password"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="password2"
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
              value="Organization Name"
              className='text-sm font-medium text-gray-900'
            />
          </div>
          <TextInput
            id="name1"
            placeholder="Your company"
            required
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className='mt-[18px] flex justify-between items-center'>
          <div className="flex items-center gap-2 text-sm">
            <Checkbox id="accept" value={termsAndConditionsAgreed} onChange={(e) => setTermsAndConditionsAgreed(e.target.checked)} />
            <Label htmlFor="accept">
              I accept the
            </Label>
            <Link className='text-[#1ABFAB]' to='/terms-and-condition'>
              Terms and Conditions
            </Link>
          </div>
        </div>

        <Button onClick={handleSubmit} type="submit" className='bg-[#1ABFAB] w-full mt-[23px]' size='xl' disabled={submitting} >
          {
            submitting ?
              <>
                <Spinner aria-label="Spinner button example" />
                <span className="pl-3">
                  Loading...
                </span>
              </>
              :
              'Create Account'
          }
        </Button>

        <div className='text-sm font-medium flex flex-row gap-1 mt-[18px]'>
          <p className='text-[#111928] dark:text-white'>
            Already have an account?
          </p>
          <Link className='text-[#1ABFAB]' to='/sign-in'>
            Sign in
          </Link>
        </div>

      </form>
    </AuthContainer>
  )
}

export default CreateAccount