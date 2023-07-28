import React from 'react'
import spreadsheetImg from '../../assets/spreadsheet-header.svg'
import galleryImg from '../../assets/gallery-header.svg'
import formImg from '../../assets/form-header.svg'
import { LuSheet } from 'react-icons/lu'
import { TfiGallery } from 'react-icons/tfi'
import { FaWpforms } from 'react-icons/fa'
import { MdOpenInNew } from 'react-icons/md'
import { getDateAndTime } from '../../utils/formatDate'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectWorkspace } from '../../redux/features/workspaceSlice'

const WorkspaceItemCard = ({ type, time, workspace, gridView }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return (
        <>
            {
                gridView ?
                    <div className='rounded-[8px] p-[24px] bg-white dark:bg-gray-800 shadow-md max-w-[300px]'>
                        <div>
                            <img src={type == 'spreadsheet' ? spreadsheetImg : type == 'gallery' ? galleryImg : type == 'form' ? formImg : ''} />
                        </div>
                        <div className='my-[9px] text-gray-500 dark:text-gray-200'>
                            {
                                type == 'spreadsheet' ? <LuSheet /> : type == 'gallery' ? <TfiGallery /> : type == 'form' ? <FaWpforms /> : ''
                            }
                        </div>
                        <p className='leading-tight text-base lg:text-lg font-bold capitalize mb-[9px] text-gray-900 dark:text-white'>
                            {type}{type == 'spreadsheet' || type == 'form' ? 's' : ''}
                        </p>
                        <p className='text-[10px] lg:text-xs text-gray-500 dark:text-gray-200 font-normal mb-[12px]'>
                            {getDateAndTime(time)}
                        </p>

                        <button className='leading-tight text-xs lg:text-[14px] font-normal flex flex-row items-center text-[#1ABFAB] my-[9px]' onClick={(e) => {
                            e.preventDefault()
                            dispatch(selectWorkspace(workspace))
                            navigate(`/${type}`)
                        }}>
                            <span>
                                Open and Edit
                            </span>
                            <MdOpenInNew className='ml-2 ' />
                        </button>

                    </div>
                    :
                    <div className='rounded-[8px] p-[12px] bg-white dark:bg-gray-800 shadow-md flex items-center gap-4'>
                        <p className='text-2xl lg:text-3xl font-medium text-[#1ABFAB] p-2 border-2 border-solid border-[#1ABFAB] rounded-lg'>
                            {type == 'spreadsheet' ? 'Sp' : type == 'gallery' ? 'Gi' : type == 'form' ? 'Fm' : ''}
                        </p>
                        <div className='flex-1'>
                            <div className=' text-gray-500 dark:text-gray-200 gap-2 flex items-center leading-tight text-base lg:text-lg'>
                                {
                                    type == 'spreadsheet' ? <LuSheet /> : type == 'gallery' ? <TfiGallery /> : type == 'form' ? <FaWpforms /> : ''
                                }
                                <p className=' font-bold capitalize text-gray-900 dark:text-white'>
                                    {type}{type == 'spreadsheet' || type == 'form' ? 's' : ''}
                                </p>
                            </div>

                            <div className='flex flex-row justify-between items-center'>
                                <p className='text-[10px] lg:text-xs text-gray-500 dark:text-gray-200 font-medium capitalize '>
                                    {getDateAndTime(time)}
                                </p>

                                <button className='leading-tight text-xs lg:text-[14px] font-normal flex flex-row items-center text-[#1ABFAB] my-[9px]' onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(selectWorkspace(workspace))
                                    navigate(`/${type}`)
                                }}>
                                    <span>
                                        Open and Edit
                                    </span>
                                    <MdOpenInNew className='ml-2 ' />
                                </button>
                            </div>

                        </div>


                    </div>
            }
        </>

    )
}

export default WorkspaceItemCard