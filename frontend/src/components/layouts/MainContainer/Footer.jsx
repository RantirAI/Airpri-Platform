import React, { useEffect } from 'react'
import { FaFacebookF, FaGithub, FaGlobe, FaTwitter } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

const Footer = () => {

  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return (
    <footer className='w-full mt-auto py-[48px] px-[12px] bg-white dark:bg-[#111928] rounded-[8px] mt-8'>
      <div className='flex justify-between items-center text-gray-500 dark:text-white'>
        <p className='text-base font-normal'>
          © 2023 Rantir, Inc. All rights reserved.
        </p>
        <div className='flex gap-[20px] '>
          <FaFacebookF />
          <FaTwitter />
          <FaGithub />
          <FaGlobe />
        </div>
      </div>
    </footer>
  )
}

export default Footer