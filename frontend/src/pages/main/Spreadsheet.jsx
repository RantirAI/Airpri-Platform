import React, { useEffect, useLayoutEffect, useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getDateAndTime } from '../../utils/formatDate'
import SpreadsheetCard from '../../components/cards/SpreadsheetCard'
import useFetch from '../../hooks/useFetch'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewSpreadsheetModal from '../../components/modals/NewSpreadsheetModal'
import DuplicateSpreadsheetModal from '../../components/modals/DuplicateSpreadsheetModal'
import SpreadsheetSettingsModal from '../../components/modals/SpreadsheetSettingsModal'
import DeleteSpreadsheetModal from '../../components/modals/DeleteSpreadsheetModal'
import ArchiveSpreadsheetModal from '../../components/modals/ArchiveSpreadsheetModal'

const Spreadsheet = () => {

  const [showDuplicateSpreadsheetModal, setShowDuplicateSpreadsheetModal] = useState(false)
  const [showSpreadsheetSettingsModal, setShowSpreadsheetSettingsModal] = useState(false)
  const [showDeleteSpreadsheetModal, setShowDeleteSpreadsheetModal] = useState(false)
  const [showArchiveSpreadsheetModal, setShowArchiveSpreadsheetModal] = useState(false)

  const { id } = useParams()

  const [showOptions, setShowOptions] = useState(false)

  const { data, loading, error } = useFetch(`/spreadsheet/${id}`, [id, showSpreadsheetSettingsModal])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <MainContainer>
      <div className='p-[15px] bg-white dark:bg-[#111928] flex flex-wrap gap-2 justify-between  items-center mt-[15px] rounded-[8px]'>
        <div className='flex gap-[15px] items-center min-w-max'>
          <TextInput
            id='spreadsheet-search'
            placeholder='Search inside the entire Spreadsheet'
            required
            type='search'
            className='min-w-[250px] lg:min-w-[500px] flex-1'
          />
          <button className='border-none outline-none text-gray-900 dark:text-white' onClick={() => {
            setShowSpreadsheetSettingsModal(true)
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
                  setShowDuplicateSpreadsheetModal(true)
                }}>
                  Duplicate Spreadsheet
                </button>
                <button className=' text-gray-700 dark:text-white w-full text-sm font-normal py-[8px] px-[16px] text-left' onClick={() => {
                  setShowArchiveSpreadsheetModal(true)
                }}>
                  Archive Spreadsheet
                </button>
                <button className='border-gray-200 border-0 border-solid border-t-[1px] text-red-500 w-full text-sm font-normal py-[8px] px-[16px] text-left' onClick={() => {
                  setShowDeleteSpreadsheetModal(true)
                }}>
                  Delete Spreadsheet (Forever)
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
            // setShowNewSpreadsheetModal(true)
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
          {data?.spreadsheet?.name}
        </p>
      </div>

      {
        loading ?
          <Spinner aria-label="Fetching spreadsheets..." />
          :
          data?.spreadsheet ?
            <div className='py-[24px] gap-[24px] flex flex-row flex-wrap'>
              {JSON.stringify(data?.spreadsheet)}
            </div>
            :
            <div className='flex flex-col items-center py-[40px]'>
              <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                Spreadsheet not found
              </h3>
              <div className='w-[250px] h-[155px] my-[20px]'>
                <img src={emptyDashboardIllustration} className='h-full w-full object-cover' />
              </div>
              <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 block' type='button' onClick={() => {
                navigate('/spreadsheets')
              }}>
                <HiOutlinePlusCircle className='mr-2 text-xl ' />
                <span>
                  All spreadsheets
                </span>
              </Button>
            </div>
      }

      <DuplicateSpreadsheetModal showModal={showDuplicateSpreadsheetModal} setShowModal={setShowDuplicateSpreadsheetModal} spreadsheet={data?.spreadsheet} />
      <SpreadsheetSettingsModal showModal={showSpreadsheetSettingsModal} setShowModal={setShowSpreadsheetSettingsModal} spreadsheet={data?.spreadsheet} />
      <DeleteSpreadsheetModal showModal={showDeleteSpreadsheetModal} setShowModal={setShowDeleteSpreadsheetModal} id={data?.spreadsheet._id} />
      <ArchiveSpreadsheetModal showModal={showArchiveSpreadsheetModal} setShowModal={setShowArchiveSpreadsheetModal} id={data?.spreadsheet._id} />

    </MainContainer>
  )
}

export default Spreadsheet