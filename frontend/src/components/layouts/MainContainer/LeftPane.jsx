import { Sidebar } from 'flowbite-react';
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


const LeftPane = () => {
  return (
    <Sidebar aria-label="Sidebar with content separator example" className='h-[calc(100%-64px)]  fixed top-16 left-0 w-1/6'>
      <Sidebar.Items>


        <Sidebar.ItemGroup>

          <Sidebar.Item
            href="#"
            icon={HiChartPie}
          >
            <p>
              Overview
            </p>
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiOutlinePlusCircle}
            onClick={(e) => {
              e.preventDefault()
              console.log('hiiiiii')
            }}
          >
            <p>
              Add a New Workspace
            </p>
          </Sidebar.Item>

          <Sidebar.Collapse
            icon={MdWorkspaces}
            label="Workspace name"
          >
            <Sidebar.Item
              href="#"
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
          </Sidebar.Collapse>

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