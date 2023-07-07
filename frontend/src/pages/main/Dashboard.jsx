import { Button } from 'flowbite-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signOut } from '../../redux/features/authSlice'

const Dashboard = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div>
      <h2 className='text-2xl text-center font-bold'>
        Dashboard
      </h2>

      <Button type='button' className='bg-red-500' onClick={(e) => {
        e.preventDefault()
        dispatch(signOut())
        localStorage.removeItem('token')
        toast.info('Signed Out!')
        navigate('/')
      }}>
        Sign Out
      </Button>

    </div>
  )
}

export default Dashboard