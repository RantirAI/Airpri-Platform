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

const Dashboard = () => {

  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false)

  return (
    <>
      <MainContainer>

        <div className='px-[50px]'>

          <div className='flex gap-[40px] p-[40px] bg-white dark:bg-gray-800 rounded-xl'>

            <div className='w-1/2'>
              <h3 className='text-3xl font-bold text-gray-900 dark:text-white mb-[10px]'>
                Welcome Back
              </h3>
              <p className='text-base font-normal text-gray-500 dark:text-gray-100 leading-[150%]'>
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
              </p>
              <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] block' type='button' onClick={() => {
                setShowNewWorkspaceModal(true)
              }}>
                <HiOutlinePlusCircle className='mr-2 text-xl ' />
                <span>
                  Start a New Workspace
                </span>
              </Button>

            </div>
            <div className='w-1/2 mt-[-40px]'>
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
            workspaces.length > 0 ?
              <div>
                <div className='flex justify-between my-[12px]'>
                  <p className='text-3xl font-bold text-gray-900'>
                    Workspaces
                  </p>
                  <button className='leading-tight text-base font-normal flex flex-row items-center text-[#1ABFAB]'>
                    <span>
                      Open and Edit
                    </span>
                    <MdOpenInNew className='ml-2 text-base ' />
                  </button>
                </div>

                <div>
                  {
                    workspaces.map(({ name, spreadsheets, forms, gallery }) => (
                      <div>
                        <div className='mb-[12px] flex items-center gap-[16px]'>
                          <img src={rectangleStackImg} className='w-[32px] h-[32px] ' />
                          <p className='text-xl text-gray-900 font-medium '>
                            {name}
                          </p>
                        </div>
                        <p className='text-base text-gray-500 font-normal'>
                          Everything about {name} here
                        </p>

                        <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
                          <WorkspaceItemCard type={'spreadsheets'} time={spreadsheets.time} />
                          <WorkspaceItemCard type={'forms'} time={forms.time} />
                          <WorkspaceItemCard type={'gallery'} time={gallery.time} />

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
      <NewWorkspaceModal openModal={showNewWorkspaceModal} setOpenModal={setShowNewWorkspaceModal} />
    </>
  )
}

export default Dashboard