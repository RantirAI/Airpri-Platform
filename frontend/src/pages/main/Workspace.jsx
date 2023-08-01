import React, { useEffect, useLayoutEffect, useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import WorkspaceItemCard from '../../components/cards/WorkspaceItemCard'
import { FiSettings } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import workspaceImage from '../../assets/image-workspace.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getDateAndTime } from '../../utils/formatDate'
import { toggleArchiveWorkspaceModal, toggleDeleteWorkspaceModal, toggleDuplicateWorkspaceModal, toggleWorkspaceSettingsModal } from '../../redux/features/modalsSlice'
import { BsGrid } from 'react-icons/bs'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import useFetch from '../../hooks/useFetch'

const Workspace = () => {

    const { workspaceId } = useParams()

    const { data, loading } = useFetch(`/workspace/${workspaceId}`, [workspaceId])


    const [showOptions, setShowOptions] = useState(false)

    const dispatch = useDispatch()
    const [gridView, setGridView] = useState(true)


    return (
        <MainContainer>

            <div className='p-[15px] bg-white dark:bg-[#111928] flex flex-wrap gap-2 justify-between  items-center mt-[15px] rounded-[8px]'>
                <div className='flex gap-[15px] items-center min-w-max'>
                    <TextInput
                        id='workspace-search'
                        placeholder='Search inside the entire Workspace'
                        required
                        type='search'
                        className='min-w-[250px] lg:min-w-[500px] flex-1'
                    />
                    <button className='border-none outline-none text-gray-900 dark:text-white' onClick={() => {
                        dispatch(toggleWorkspaceSettingsModal(true))
                    }}>
                        <FiSettings />
                    </button>
                    <div className='relative min-w-max text-gray-900 dark:text-white'>
                        <button className='w-full min-w-[222px] ' onClick={() => {
                            setShowOptions(!showOptions)
                        }}>
                            <SlOptionsVertical />
                        </button>
                        {
                            showOptions &&
                            <div className='absolute w-full bg-white dark:bg-gray-700 shadow-sm rounded-[6px]' onClick={() => {
                                setShowOptions(false)
                            }}>
                                <button className=' text-gray-700 dark:text-white w-full text-sm font-normal py-[8px] px-[16px] text-left ' onClick={() => {
                                    dispatch(toggleDuplicateWorkspaceModal(true))
                                }}>
                                    Duplicate Workspace
                                </button>
                                <button className=' text-gray-700 dark:text-white w-full text-sm font-normal py-[8px] px-[16px] text-left' onClick={() => {
                                    dispatch(toggleArchiveWorkspaceModal(true))
                                }}>
                                    Archive Workspace
                                </button>
                                <button className='border-gray-200 border-0 border-solid border-t-[1px] text-red-500 w-full text-sm font-normal py-[8px] px-[16px] text-left' onClick={() => {
                                    dispatch(toggleDeleteWorkspaceModal(true))
                                }}>
                                    Delete Workspace (Forever)
                                </button>
                            </div>
                        }

                    </div>
                </div>
                <div className='gap-[10px] flex flex-row flex-wrap items-center '>
                    <Button className='bg-[#1ABFAB] text-white dark:text-gray-900   block' type='button' onClick={() => {
                    }}>
                        <HiDownload className='mr-2 text-lg ' />
                        <span>
                            Share & Embed
                        </span>
                    </Button>
                    <button className=' text-gray-900 dark:text-white flex items-center' type='button' onClick={() => {
                    }}>
                        <HiOutlinePlusCircle className='mr-2 text-lg ' />
                        <span>
                            Add a New Spreadsheet
                        </span>
                    </button>
                </div>

            </div>

            <div>
                {
                    loading ?
                        <Spinner />
                        :
                        <div>

                            <div className='mt-[24px] flex justify-between'>
                                <div className='gap-[16px] flex items-center '>
                                    <div className='max-w-[100px] lg:max-w-[720px] max-h-[150px] lg:max-h-[200px]'>
                                        <img src={workspaceImage} className='h-full w-full object-contain' />
                                    </div>
                                    <div>
                                        <div className='mb-[12px] flex items-center gap-[16px]'>
                                            <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                                            <p className='text-base lg:text-lg font-semibold text-gray-900 dark:text-white'>
                                                {data?.workspace?.name}
                                            </p>
                                        </div>
                                        <p className='text-gray-500 dark:text-gray-100 text-sm my-[16px] font-bold'>
                                            {getDateAndTime(data?.workspace?.updatedAt)}
                                        </p>
                                        <p className='text-[14px] lg:text-base font-normal leading-[150%] text-gray-500 dark:text-gray-50'>
                                            {data?.workspace?.description}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex flex-row gap-1 self-start'>
                                    <button className={`rounded-md capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 ${gridView ? 'bg-gray-200 dark:bg-gray-700 ' : ''} text-[10px] lg:text-xs`} onClick={() => {
                                        setGridView(true)
                                    }}>
                                        <span>
                                            Grid view
                                        </span>
                                        <BsGrid className='ml-2 text-base ' />
                                    </button>
                                    <button className={`rounded-md capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 ${gridView ? '' : 'bg-gray-200 dark:bg-gray-700 '} text-[10px] lg:text-xs`} onClick={() => {
                                        setGridView(false)
                                    }}>
                                        <span>
                                            List view
                                        </span>
                                        <AiOutlineUnorderedList className='ml-2 text-base ' />
                                    </button>
                                </div>
                            </div>

                            <div className={`py-[24px] gap-[24px] flex ${gridView ? 'flex-row flex-wrap' : 'flex-col'}`}>
                                <WorkspaceItemCard type={'spreadsheet'} time={data?.workspace?.updatedAt} workspace={data?.workspace} gridView={gridView} workspaceId={workspaceId} />
                                {/* <WorkspaceItemCard type={'form'} time={data?.updatedAt} workspace={data} /> */}
                                {/* <WorkspaceItemCard type={'gallery'} time={data?.updatedAt} workspace={data} /> */}
                            </div>
                        </div>
                }
            </div>



        </MainContainer>
    )
}

export default Workspace