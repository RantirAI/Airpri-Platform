import { Sidebar, Spinner } from 'flowbite-react';
import React from 'react';
import { FaWpforms } from 'react-icons/fa';
import { HiChartPie, HiOutlinePlusCircle, HiViewBoards } from 'react-icons/hi';
import { IoIosPeople } from 'react-icons/io';
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
import { selectWorkspace } from '../../../redux/features/workspaceSlice';
import { useNavigate } from 'react-router-dom';
import { toggleNewWorkspaceModal } from '../../../redux/features/modalsSlice';


const LeftPane = () => {

  const currentWorkspace = useSelector(state => state.workspace)

  const workspaces = useFetch('workspace', [])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Sidebar aria-label="Left pane" className='h-[calc(100%-64px)]  fixed top-16 left-0 w-1/6'>
      <Sidebar.Items>


        <Sidebar.ItemGroup>

          <Sidebar.Item
            href=''
            onClick={(e) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
            icon={HiChartPie}
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
                      className={currentWorkspace.workspace?.name == workspace.name ? 'bg-gray-200' : ''}
                    >
                      <div onClick={() => {
                        dispatch(selectWorkspace(workspace))
                      }}>
                        <Sidebar.Item
                          onClick={() => {
                            navigate('/workspace')
                          }}
                          icon={HiChartPie}
                        >
                          <p>
                            Overview
                          </p>
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={LuSheet}>
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
                      </div>
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