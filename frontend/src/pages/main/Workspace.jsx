import React, { useEffect, useLayoutEffect, useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, TextInput } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import WorkspaceItemCard from '../../components/cards/WorkspaceItemCard'
import { FiSettings } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import workspaceImage from '../../assets/image-workspace.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDateAndTime } from '../../utils/formatDate'
import { toggleArchiveWorkspaceModal, toggleDeleteWorkspaceModal } from '../../redux/features/modalsSlice'

const Workspace = () => {

    const [showOptions, setShowOptions] = useState(false)
    const { workspace } = useSelector(state => state.workspace)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!workspace) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <MainContainer>

            <div className='p-[15px] bg-white dark:bg-[#111928] flex justify-between  items-center'>
                <div className='flex gap-[15px] items-center min-w-max'>
                    <TextInput
                        id='workspace-search'
                        placeholder='Search inside the entire Workspace'
                        required
                        type='search'
                        className='min-w-[500px]'
                    />
                    <FiSettings />
                    <div className='relative min-w-max'>
                        <button className='w-full min-w-[222px] ' onClick={() => {
                            setShowOptions(!showOptions)
                        }}>
                            <SlOptionsVertical />
                        </button>
                        {
                            showOptions &&
                            <div className='absolute w-full bg-white shadow-sm rounded-[6px]' onClick={() => {
                                setShowOptions(false)
                            }}>
                                <button className=' text-gray-700 w-full text-sm font-normal py-[8px] px-[16px] text-left'>
                                    Duplicate Workspace
                                </button>
                                <button className=' text-gray-700 w-full text-sm font-normal py-[8px] px-[16px] text-left' onClick={() => {
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
                <div className='gap-[10px] flex flex-row items-center'>
                    <Button className='bg-[#1ABFAB] text-white dark:text-gray-900   block' type='button' onClick={() => {
                    }}>
                        <HiDownload className='mr-2 text-xl ' />
                        <span>
                            Share & Embed
                        </span>
                    </Button>
                    <button className=' text-gray-900 dark:text-white flex items-center' type='button' onClick={() => {
                    }}>
                        <HiOutlinePlusCircle className='mr-2 text-xl ' />
                        <span>
                            Add a New Spreadsheet
                        </span>
                    </button>
                </div>

            </div>

            <div className='gap-[16px] flex items-center mt-[24px]'>
                <div className='max-w-[720px] max-h-[200px]'>
                    <img src={workspaceImage} className='h-full w-full object-contain' />
                </div>
                <div>
                    <div className='mb-[12px] flex items-center gap-[16px]'>
                        <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                        <p className='text-2xl font-semibold text-gray-900'>
                            {workspace?.name}
                        </p>
                    </div>
                    <p className='text-gray-500 text-sm my-[16px] font-bold'>
                        {getDateAndTime(workspace?.updatedAt)}
                    </p>
                    <p className='text-base font-normal leading-[150%] text-gray-500'>
                        {workspace?.description}
                    </p>
                </div>


            </div>

            <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
                <WorkspaceItemCard type={'spreadsheets'} time={workspace.updatedAt} />
                <WorkspaceItemCard type={'forms'} time={workspace.updatedAt} />
                <WorkspaceItemCard type={'gallery'} time={workspace.updatedAt} />
            </div>


        </MainContainer>
    )
}

export default Workspace