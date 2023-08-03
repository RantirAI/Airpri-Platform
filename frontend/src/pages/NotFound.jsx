import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      <h2>
        NotFound
      </h2>
      <Link to="/" className='text-blue-600 underline underline-offset-1'>Home</Link>
    </div>
  )
}

export default NotFound