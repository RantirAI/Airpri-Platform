import React, { useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, Spinner } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { AiFillEye, AiOutlineUnorderedList } from 'react-icons/ai'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewWorkspaceModal from '../../components/modals/NewWorkspaceModal'
import { workspaces } from '../../../data'
import { MdOpenInNew } from 'react-icons/md'
import WorkspaceItemCard from '../../components/cards/WorkspaceItemCard'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import { toggleNewWorkspaceModal } from '../../redux/features/modalsSlice'
import { useNavigate } from 'react-router-dom'
import { BsGrid } from 'react-icons/bs'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { showNewWorkspaceModal } = useSelector(state => state.modals)

  const workspaces = useFetch('workspace', [showNewWorkspaceModal])

  const [gridView, setGridView] = useState(true)


  return (
    <MainContainer>

      <div className='px-[20px] lg:px-[50px] mt-[20px]'>

        <div className='flex flex-col lg:flex-row gap-[20px] lg:gap-[40px] p-[20px] lg:p-[40px] bg-white dark:bg-gray-800 rounded-xl'>

          <div className='w-full w-/12'>
            <h3 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-[10px]'>
              Welcome Back
            </h3>
            <p className='text-xs lg:text-[14px] font-normal text-gray-500 dark:text-gray-100 '>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
            </p>
            <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] block' type='button' onClick={() => {
              dispatch(toggleNewWorkspaceModal(true))
            }}>
              <HiOutlinePlusCircle className='mr-2 text-lg ' />
              <span>
                Start a New Workspace
              </span>
            </Button>

          </div>
          <div className='w-full lg:mt-[-40px]'>
            <img src={welcomeIllustration} className='h-full w-full object-cover' />
          </div>

        </div>


        <Alert
          color='gray'
          className='my-5 bg-gray-100'
        >
          <p className='text-xs lg:text-[14px] font-semibold'>
            Oh snap, your on the basic plan !
          </p>
          <p className='text-[10px] lg:text-xs font-normal my-2'>
            To view more plans to create a more robust data expereience you need to upgrade. We have generally very flexible and easy to scale AI-data plans for your team.
          </p>
          <Button className='bg-gray-700 text-white dark:text-gray-900 mt-[20px] block' type='button'>
            <AiFillEye className='mr-2 text-lg ' />
            <span>
              View plans
            </span>

          </Button>
        </Alert>


        {
          workspaces.loading ?
            <Spinner aria-label="Fetching spreadsheets..." />
            :
            <>
              {workspaces.data?.workspaces?.length > 0 ?
                <div>
                  <div className='flex justify-between mt-[12px] mb-5'>
                    <p className='text-lg lg:text-xl font-bold text-gray-900 dark:text-white'>
                      Workspaces
                    </p>
                    <div className='flex flex-row gap-1'>
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

                  <div>
                    {
                      workspaces?.data?.workspaces?.map((workspace) => (
                        <div>
                          <div className='flex justify-between my-[12px]'>
                            <div className='flex items-center gap-[16px]'>
                              <img src={rectangleStackImg} className='w-[24px] h-[24px] ' />
                              <p className='text-base lg:text-lg text-gray-900 dark:text-gray-50 font-medium '>
                                {workspace.name}
                              </p>
                            </div>
                            <button className='leading-tight text-[14px] lg:text-base font-normal flex flex-row items-center text-[#1ABFAB]' onClick={() => {
                              navigate(`/workspace/${workspace._id}`)
                            }}>
                              <span>
                                Open and Edit
                              </span>
                              <MdOpenInNew className='ml-2 text-base ' />
                            </button>
                          </div>

                          <p className='text-[10px] lg:text-xs text-gray-500 dark:text-gray-300 font-normal'>
                            Everything about {workspace.name} here
                          </p>

                          <div className={`py-[24px] gap-[24px] flex ${gridView ? 'flex-row flex-wrap' : 'flex-col'}`}>
                            <WorkspaceItemCard type={'spreadsheet'} time={workspace.updatedAt} workspace={workspace} gridView={gridView} workspaceId={workspace._id} />
                            {/* <WorkspaceItemCard type={'form'} time={workspace.updatedAt} workspace={workspace} />
                            <WorkspaceItemCard type={'gallery'} time={workspace.updatedAt} workspace={workspace} />
                            <WorkspaceItemCard type={'gallery'} time={workspace.updatedAt} workspace={workspace} /> */}

                          </div>

                        </div>
                      ))
                    }
                  </div>

                </div>
                :
                <div className='flex flex-col items-center py-[40px]'>
                  <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                    Get started by adding a new workspace here
                  </h3>
                  <div className='w-[250px] h-[155px] my-[20px]'>
                    <img src={emptyDashboardIllustration} className='h-full w-full object-cover' />
                  </div>
                  <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 block' type='button' onClick={() => {
                    dispatch(toggleNewWorkspaceModal(true))
                  }}>
                    <HiOutlinePlusCircle className='mr-2 text-xl ' />
                    <span>
                      Start a New Workspace
                    </span>
                  </Button>
                </div>
              }
            </>
        }
      </div>

    </MainContainer>
  )
}

export default Dashboard