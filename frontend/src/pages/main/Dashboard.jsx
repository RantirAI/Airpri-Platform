import React, { useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiOutlinePlusCircle } from 'react-icons/hi'
import { AiFillEye } from 'react-icons/ai'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewWorkspaceModal from '../../components/modals/NewWorkspaceModal'
import { workspaces } from '../../../data'
import { MdOpenInNew } from 'react-icons/md'
import WorkspaceItemCard from '../../components/cards/WorkspaceItemCard'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import { useDispatch, useSelector } from 'react-redux'
import useFetch from '../../hooks/useFetch'
import { toggleNewWorkspaceModal } from '../../redux/features/modalsSlice'
import { selectWorkspace } from '../../redux/features/workspaceSlice'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const { workspace } = useSelector(state => state.workspace)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { showNewWorkspaceModal } = useSelector(state => state.modals)

  const workspaces = useFetch('workspace', [showNewWorkspaceModal])


  return (
    <MainContainer>

      <div className='px-[20px] lg:px-[50px]'>

        <div className='flex flex-col lg:flex-row gap-[20px] lg:gap-[40px] p-[20px] lg:p-[40px] bg-white dark:bg-gray-800 rounded-xl'>

          <div className='w-full w-/12'>
            <h3 className='text-3xl font-bold text-gray-900 dark:text-white mb-[10px]'>
              Welcome Back
            </h3>
            <p className='text-base font-normal text-gray-500 dark:text-gray-100 leading-[150%]'>
              Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
            </p>
            <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] block' type='button' onClick={() => {
            dispatch(toggleNewWorkspaceModal(true))
            }}>
              <HiOutlinePlusCircle className='mr-2 text-xl ' />
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
          <p className='text-base font-semibold'>
            Oh snap, your on the basic plan !
          </p>
          <p className='text-sm font-normal my-2'>
            To view more plans to create a more robust data expereience you need to upgrade. We have generally very flexible and easy to scale AI-data plans for your team.
          </p>
          <Button className='bg-gray-700 text-white dark:text-gray-900 mt-[20px] block' type='button'>
            <AiFillEye className='mr-2 text-xl ' />
            <span>
              View plans
            </span>

          </Button>
        </Alert>


        {
          workspaces.data?.workspaces?.length > 0 ?
            <div>
              <div className='flex justify-between my-[12px]'>
                <p className='text-3xl font-bold text-gray-900 dark:text-white'>
                  Workspaces
                </p>
              </div>

              <div>
                {
                  workspaces?.data?.workspaces?.map((workspace) => (
                    <div>
                      <div className='flex justify-between my-[12px]'>
                        <div className='flex items-center gap-[16px]'>
                          <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                          <p className='text-xl text-gray-900 dark:text-gray-50 font-medium '>
                            {workspace.name}
                          </p>
                        </div>
                        <button className='leading-tight text-base font-normal flex flex-row items-center text-[#1ABFAB]' onClick={() => {
                          dispatch(selectWorkspace(workspace))
                          navigate('/workspace')
                        }}>
                          <span>
                            Open and Edit
                          </span>
                          <MdOpenInNew className='ml-2 text-base ' />
                        </button>
                      </div>

                      <p className='text-base text-gray-500 dark:text-gray-300 font-normal'>
                        Everything about {workspace.name} here
                      </p>

                      <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
                        <WorkspaceItemCard type={'spreadsheets'} time={workspace.updatedAt} />
                        <WorkspaceItemCard type={'forms'} time={workspace.updatedAt} />
                        <WorkspaceItemCard type={'gallery'} time={workspace.updatedAt} />

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
              <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 block' type='button'>
                <HiOutlinePlusCircle className='mr-2 text-xl ' />
                <span>
                  Start a New Workspace
                </span>
              </Button>
            </div>
        }
      </div>

    </MainContainer>
  )
}

export default Dashboard