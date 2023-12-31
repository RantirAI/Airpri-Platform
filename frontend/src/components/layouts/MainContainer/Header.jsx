import { Avatar, Button, DarkThemeToggle, Dropdown } from 'flowbite-react'
import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import lightModeLogo from '../../../assets/airpri-light-mode-logo.svg'
import darkModeLogo from '../../../assets/airpri-dark-mode-logo.svg'
import grid from '../../../assets/grid.svg'
import app from '../../../assets/app.svg'
import genie from '../../../assets/genie.svg'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from '../../../redux/features/authSlice'
import { toast } from 'react-toastify'
import { IoMdClose } from 'react-icons/io'
import { GiHamburgerMenu } from 'react-icons/gi'
import useFetch from '../../../hooks/useFetch'
import { setAxiosToken } from '../../../config/axios'

const Header = ({ showLeftPane, setShowLeftPane }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { workspaceId } = useParams()

  const currentWorkspace = useFetch(`/workspace/${workspaceId}`, [workspaceId])

  return (
    <header className='flex justify-between items-center py-[10px] px-[20px] bg-white dark:bg-[#111928] border-solid border-gray-200 dark:border-gray-700 border-0 border-b-2 fixed top-0 right-0 left-0 w-full z-10 text-[10px] lg:text-xs'>
      <div className='flex gap-[15px]'>
        <Link to='/' className='block w-[40px] h-[40px] '>
          <img src={darkModeLogo} className='hidden dark:block object-cover w-full h-full' />
          <img src={lightModeLogo} className='block dark:hidden object-cover w-full h-full' />
        </Link>
        {
          currentWorkspace.data?.workspace &&
          <div className='border border-solid border-gray-300 p-[12px] rounded-[8px] bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-50 leading-tight text-[10px] lg:text-xs font-normal flex items-center gap-2' >
            <p>
              {
                currentWorkspace.data?.workspace?.name
              }
            </p>
            <button onClick={() => {
              navigate('/dashboard')
            }}>
              <IoMdClose />
            </button>
          </div>
        }
      </div>

      <nav className='hidden lg:flex gap-3 text-gray-900 dark:text-white'>
        <button className='p-[6px] rounded-[8px] flex items-center gap-1.5 border border-solid border-[#D1D5DB]'>
          <img src={grid} className='block dark:hidden w-4 h-4' />
          <span>
            Data
          </span>
        </button>
        <button className='p-[6px] rounded-[8px] flex items-center gap-1.5 border-0 border-solid border-[#D1D5DB] hover:border-[1px]'>
          <img src={app} className='block dark:hidden w-4 h-4' />
          <span>
            Apps
          </span>
        </button>
        <button className='p-[6px] rounded-[8px] flex items-center gap-1.5 border-0 border-solid border-[#D1D5DB] hover:border-[1px]'>
          <img src={genie} className='block dark:hidden w-4 h-4' />
          <span>
            AI
          </span>
        </button>
      </nav>

      <div className='flex gap-2'>
        <button onClick={() => {
          setShowLeftPane(!showLeftPane)
        }} className='lg:hidden text-gray-900 dark:text-white'>
          <GiHamburgerMenu />
        </button>
        <DarkThemeToggle />
        <Dropdown
          inline
          label={<Avatar
            alt={'User avatar'}
            img={'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80'}
            rounded
          />}
        >
          <Dropdown.Item className='hover:!bg-inherit'>
            <Button type='button' className='bg-red-600 dark:bg-red-400 hover:!bg-red-700 hover:dark:!bg-red-500' onClick={(e) => {
              e.preventDefault()
              dispatch(signOut())
              setAxiosToken(null)
              localStorage.removeItem('token')
              toast.info('Signed Out!')
              navigate('/')
            }}>
              Sign Out
            </Button>
          </Dropdown.Item>
        </Dropdown>

      </div>
    </header>
  )
}

export default Header