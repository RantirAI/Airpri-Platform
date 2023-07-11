import React from 'react'
import authImage from '../../assets/auth-image.svg'
import authDarkModeLogo from '../../assets/auth-dark-mode-logo.svg'
import authLightModeLogo from '../../assets/auth-light-mode-logo.svg'
import { Link } from 'react-router-dom'

const AuthContainer = ({ children, title }) => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-300 dark:bg-gray-700 font-inter'>
      <div className='w-5/6 md:w-4/5 lg:w-2/3 max-w-5xl flex rounded-[16px] bg-gray-50 dark:bg-gray-600'>
        <div className='w-[35%] hidden lg:block rounded-tl-[16px] rounded-bl-[16px] min-h-full'>
          <img src={authImage} className='rounded-tl-[16px] rounded-bl-[16px] h-full w-full object-cover' />
        </div>
        <div className='p-[16px] md:p-[32px] lg:p-[60px] w-full lg:w-[65%] rounded-tr-[16px] rounded-br-[16px]'>
          <Link to='/' className='mt-[23px] block mx-auto lg:mx-0 mb-[23px]'>
            <img src={authDarkModeLogo} className='hidden dark:block' />
            <img src={authLightModeLogo} className='block dark:hidden' />
          </Link>

          <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white'>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthContainer