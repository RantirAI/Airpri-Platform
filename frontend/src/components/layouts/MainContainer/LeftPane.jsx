import { Button, Sidebar, Spinner } from 'flowbite-react';
import React, { useEffect } from 'react';
import { FaWpforms } from 'react-icons/fa';
import { HiChartPie, HiLightningBolt, HiOutlinePlusCircle, HiViewBoards } from 'react-icons/hi';
import { IoIosPeople, IoMdClose } from 'react-icons/io';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { LuNetwork, LuSheet } from 'react-icons/lu';
import { MdWorkspaces } from 'react-icons/md';
import { RiDeleteBin6Fill, RiOpenSourceFill } from 'react-icons/ri';
import { TbMessageChatbot } from 'react-icons/tb';
import { TfiGallery } from 'react-icons/tfi';
import { CgLoadbarDoc } from 'react-icons/cg'
import { BiSolidHelpCircle } from 'react-icons/bi'
import useFetch from '../../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toggleNewWorkspaceModal } from '../../../redux/features/modalsSlice';
import { BsFileSpreadsheet } from 'react-icons/bs';
import { HiSquare2Stack } from 'react-icons/hi2'
import { GoOrganization } from 'react-icons/go'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const LeftPane = ({ showLeftPane, setShowLeftPane }) => {
  const { pathname } = useLocation()

  const { user } = useSelector(state => state.auth)

  const { workspaceId } = useParams()

  const { showNewWorkspaceModal, showDeleteWorkspaceModal, showArchiveWorkspaceModal, showDuplicateWorkspaceModal, showWorkspaceSettingsModal } = useSelector(state => state.modals)

  const workspaces = useFetch('workspace', [showNewWorkspaceModal, showDeleteWorkspaceModal, showArchiveWorkspaceModal, showDuplicateWorkspaceModal, showWorkspaceSettingsModal])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pathname.includes('/spreadsheet/') && !pathname.includes('/form/') && window.innerWidth >= 1024) {
      setShowLeftPane(true)
    }
  }, [pathname])

  return (
    <Sidebar aria-label="Left pane" className={`h-[calc(100%-64px)]  fixed top-16 left-0 w-full lg:w-[15%] z-10 ${!showLeftPane && 'left-[-100%] lg:left-[-15%]'} border-solid border-[#e6e7eb] border-0 border-r-[1px] left-pane`}>
      <Button color='failure' size='xs' onClick={() => {
        setShowLeftPane(false)
      }} className='absolute top-2 right-2 px-0 lg:hidden' >
        <IoMdClose />
      </Button>
      {
        !showLeftPane &&
        <button onClick={() => {
          setShowLeftPane(true)
        }} className='hidden lg:block absolute -right-7 top-4 p-1.5 rounded-md hover:bg-gray-200 dark:bg-gray-700'>
          <FiChevronsRight />
        </button>
      }

      <Sidebar.Items className='pt-4 lg:pt-0 '>


        <Sidebar.ItemGroup >

          <div className='flex flex-row items-center justify-between gap-2'>
            <Sidebar.Item
              href=''
              onClick={(e) => {
                e.preventDefault()
                navigate('/dashboard')
              }}
              icon={GoOrganization}
            >
              <p className='text-xs lg:text-[14px]'>
                {user.orgName}
              </p>
            </Sidebar.Item>
            <button onClick={() => {
              setShowLeftPane(false)
            }} className='hidden lg:block'>
              <FiChevronsLeft />
            </button>
          </div>


          <div className='lg:!hidden'>
            <Sidebar.Item
              href=''
              onClick={(e) => {
                e.preventDefault()
              }}
              icon={BsFileSpreadsheet}
            >
              <p >
                Data
              </p>
            </Sidebar.Item>
            <Sidebar.Item
              href=''
              onClick={(e) => {
                e.preventDefault()
              }}
              icon={HiSquare2Stack}
            >
              <p>
                Apps
              </p>
            </Sidebar.Item>
            <Sidebar.Item
              href=''
              onClick={(e) => {
                e.preventDefault()
              }}
              icon={HiLightningBolt}
            >
              <p>
                AI
              </p>
            </Sidebar.Item>
          </div>



        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup >

          <Sidebar.Item
            href=''
            onClick={(e) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
            icon={HiChartPie}
            className='!text-xs'
          >
            <p>
              Overview
            </p>
          </Sidebar.Item>

          <Sidebar.Item
            href=''
            onClick={(e) => {
              e.preventDefault()
              dispatch(toggleNewWorkspaceModal(true))
            }}
            icon={HiOutlinePlusCircle}
          >
            <p>
              Add a New Workspace
            </p>
          </Sidebar.Item>

          {
            workspaces.loading ?
              <Spinner aria-label="Fetching workspaces" className='mx-auto block' />
              :
              <>
                {
                  workspaces.data?.workspaces?.map((workspace) => (
                    <Sidebar.Collapse
                      icon={MdWorkspaces}
                      label={workspace.name}
                      className={workspaceId == workspace._id ? 'bg-gray-200 dark:bg-gray-700' : ''}
                      key={workspace?._id}
                    >

                      <Sidebar.Item
                        href=''
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(`/workspace/${workspace._id}`)
                        }}
                        icon={HiChartPie}
                      >
                        <p>
                          Overview
                        </p>
                      </Sidebar.Item>
                      <Sidebar.Item href=''
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(`/workspace/${workspace._id}/spreadsheet`)
                        }} icon={LuSheet}>
                        Spreadsheets
                      </Sidebar.Item>
                      <Sidebar.Item href="#" icon={FaWpforms}>
                        Forms
                      </Sidebar.Item>
                      <Sidebar.Item href="#" icon={TfiGallery}>
                        Gallery
                      </Sidebar.Item>
                      <Sidebar.Item href="#" icon={LuNetwork}>
                        Automation
                      </Sidebar.Item>
                      <Sidebar.Item href="#" icon={TbMessageChatbot}>
                        AI Chat
                      </Sidebar.Item>
                      <Sidebar.Item href="#" icon={IoIosPeople}>
                        Members
                      </Sidebar.Item>
                    </Sidebar.Collapse>
                  ))
                }
              </>
          }



        </Sidebar.ItemGroup>


        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={LiaFileInvoiceDollarSolid}
          >
            <p>
              Billing & Invoice
            </p>
          </Sidebar.Item>

          <Sidebar.Item
            href="#"
            icon={RiDeleteBin6Fill}
          >
            <p>
              Archive & Trash
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>


        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="#"
            icon={CgLoadbarDoc}
          >
            <p>
              Docs
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={RiOpenSourceFill}
          >
            <p>
              Open Source
            </p>
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={BiSolidHelpCircle}
          >
            <p>
              Help
            </p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>


      </Sidebar.Items>
    </Sidebar>
  )
}

export default LeftPane