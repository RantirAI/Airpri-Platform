import React, { useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, TextInput } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import { AiFillEye } from 'react-icons/ai'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewWorkspaceModal from '../../components/modals/NewWorkspaceModal'
import { workspaces } from '../../../data'
import { MdOpenInNew } from 'react-icons/md'
import WorkspaceItemCard from '../../components/cards/WorkspaceItemCard'
import { FiSettings } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import workspaceImage from '../../assets/image-workspace.svg'

const Workspace = () => {

    const [showOptions, setShowOptions] = useState(false)


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
                            <div className='absolute w-full bg-white shadow-sm rounded-[6px]'>
                                <button className=' text-gray-700 w-full text-sm font-normal py-[8px] px-[16px] text-left'>
                                    Duplicate Workspace
                                </button>
                                <button className=' text-gray-700 w-full text-sm font-normal py-[8px] px-[16px] text-left'>
                                    Archive Workspace
                                </button>
                                <button className='border-gray-200 border-0 border-solid border-t-[1px] text-red-500 w-full text-sm font-normal py-[8px] px-[16px] text-left'>
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
                <div className='w-[720px] '>
                    <img src={workspaceImage} className='h-full w-full object-contain' />
                </div>
                <div>
                    <div className='mb-[12px] flex items-center gap-[16px]'>
                        <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                        <p className='text-2xl font-semibold text-gray-900'>
                            {name} Drivers
                        </p>
                    </div>
                    <p className='text-gray-500 text-sm my-[16px] font-bold'>
                        Last Edited:  June 20th, 2024
                    </p>
                    <p className='text-base font-normal leading-[150%] text-gray-500'>
                        This should be a demo on the capabilitiesWhen we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.
                    </p>
                </div>


            </div>

            <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
                <WorkspaceItemCard type={'spreadsheets'} />
                <WorkspaceItemCard type={'forms'} />
                <WorkspaceItemCard type={'gallery'} />
            </div>


        </MainContainer>
    )
}

export default Workspace