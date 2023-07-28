import React from 'react'
import spreadsheetImg from '../../assets/spreadsheet-header.svg'
import galleryImg from '../../assets/gallery-header.svg'
import formImg from '../../assets/form-header.svg'
import { LuSheet } from 'react-icons/lu'
import { TfiGallery } from 'react-icons/tfi'
import { FaWpforms } from 'react-icons/fa'
import { MdOpenInNew } from 'react-icons/md'
import { getDateAndTime } from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'

const SpreadsheetCard = ({ id, time, name }) => {
    const navigate = useNavigate()
    return (
        <div className='rounded-[8px] p-[24px] bg-white dark:bg-gray-800 shadow-md max-w-[350px]'>
            <div>
                <img src={spreadsheetImg} />
            </div>
            <div className='my-[9px] text-gray-500 dark:text-gray-200'>
                <LuSheet />
            </div>
            <p className='leading-tight text-base lg:text-lg font-bold capitalize mb-[9px] text-gray-900 dark:text-white'>
                {name}
            </p>
            <p className='text-[10px] text-[xs] text-gray-500 dark:text-gray-200 font-normal mb-[12px]'>
                {getDateAndTime(time)}
            </p>

            <button className='leading-tight text-xs lg:text-[14px] font-normal flex flex-row items-center text-[#1ABFAB] my-[9px]' onClick={() => {
                navigate(`/spreadsheet/${id}`)
            }}>
                <span>
                    Open and Edit
                </span>
                <MdOpenInNew className='ml-2 ' />
            </button>

        </div>
    )
}

export default SpreadsheetCard