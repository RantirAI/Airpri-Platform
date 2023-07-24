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
import { useNavigate } from 'react-router-dom'
import { getDateAndTime } from '../../utils/formatDate'
import { toggleArchiveWorkspaceModal, toggleDeleteWorkspaceModal, toggleDuplicateWorkspaceModal, toggleWorkspaceSettingsModal } from '../../redux/features/modalsSlice'
import SpreadsheetCard from '../../components/cards/SpreadsheetCard'
import useFetch from '../../hooks/useFetch'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewSpreadsheetModal from '../../components/modals/NewSpreadsheetModal'

const Spreadsheets = () => {
    const [showNewSpreadsheetModal, setShowNewSpreadsheetModal] = useState(false)

    const [showOptions, setShowOptions] = useState(false)
    const { workspace } = useSelector(state => state.workspace)

    const { data, loading, error } = useFetch(`/workspace/${workspace._id}`, [showNewSpreadsheetModal, workspace])

    const navigate = useNavigate()
    const dispatch = useDispatch()

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
                        <HiDownload className='mr-2 text-xl ' />
                        <span>
                            Share & Embed
                        </span>
                    </Button>
                    <button className=' text-gray-900 dark:text-white flex items-center' type='button' onClick={() => {
                        setShowNewSpreadsheetModal(true)
                    }}>
                        <HiOutlinePlusCircle className='mr-2 text-xl ' />
                        <span>
                            Add a New Spreadsheet
                        </span>
                    </button>
                </div>

            </div>

            <div className='my-[12px] flex items-center gap-[16px]'>
                <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>
                    {workspace?.name}
                </p>
            </div>

            {
                loading ?
                    <Spinner aria-label="Fetching spreadsheets..." />
                    :
                    data?.spreadsheets.length > 0 ?
                        <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
                            {
                                data?.spreadsheets?.map((_id, updatedAt,) => (
                                    <SpreadsheetCard id={_id} time={updatedAt} />
                                ))
                            }
                        </div>
                        :
                        <div className='flex flex-col items-center py-[40px]'>
                            <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                                Get started by adding a new spreadsheet here
                            </h3>
                            <div className='w-[250px] h-[155px] my-[20px]'>
                                <img src={emptyDashboardIllustration} className='h-full w-full object-cover' />
                            </div>
                            <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 block' type='button' onClick={() => {
                                setShowNewSpreadsheetModal(true)
                            }}>
                                <HiOutlinePlusCircle className='mr-2 text-xl ' />
                                <span>
                                    Start a New Spreadsheet
                                </span>
                            </Button>
                        </div>
            }

            <NewSpreadsheetModal showModal={showNewSpreadsheetModal} setShowModal={setShowNewSpreadsheetModal} />

        </MainContainer>
    )
}

export default Spreadsheets