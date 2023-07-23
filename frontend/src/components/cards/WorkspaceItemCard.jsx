import React from 'react'
import spreadsheetImg from '../../assets/spreadsheet-header.svg'
import galleryImg from '../../assets/gallery-header.svg'
import formImg from '../../assets/form-header.svg'
import { LuSheet } from 'react-icons/lu'
import { TfiGallery } from 'react-icons/tfi'
import { FaWpforms } from 'react-icons/fa'
import { MdOpenInNew } from 'react-icons/md'
import { getDateAndTime } from '../../utils/formatDate'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const WorkspaceItemCard = ({ type, time }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return (
        <div className='rounded-[8px] p-[24px] bg-white dark:bg-gray-800 shadow-md max-w-[350px]'>
            <div>
                <img src={type == 'spreadsheets' ? spreadsheetImg : type == 'gallery' ? galleryImg : type == 'forms' ? formImg : ''} />
            </div>
            <div className='my-[9px] text-gray-500 dark:text-gray-200'>
                {
                    type == 'spreadsheets' ? <LuSheet /> : type == 'gallery' ? <TfiGallery /> : type == 'forms' ? <FaWpforms /> : ''
                }
            </div>
            <p className='leading-tight text-2xl font-bold capitalize mb-[9px] text-gray-900 dark:text-white'>
                {type}
            </p>
            <p className='text-base text-gray-500 dark:text-gray-200 font-normal mb-[12px]'>
                {getDateAndTime(time)}
            </p>

            <button className='leading-tight text-base font-normal flex flex-row items-center text-[#1ABFAB] my-[9px]' onClick={(e) => {
                e.preventDefault()
                navigate(`/${type}`)
            }}>
                <span>
                    Open and Edit
                </span>
                <MdOpenInNew className='ml-2 text-base ' />
            </button>

        </div>
    )
}

export default WorkspaceItemCard