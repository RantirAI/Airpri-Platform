import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import welcomeIllustration from '../../assets/welcome-illustration.svg'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import { FiCheckCircle, FiSettings } from 'react-icons/fi'
import { SlOptionsVertical } from 'react-icons/sl'
import rectangleStackImg from '../../assets/rectangle-stack.svg'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getDateAndTime } from '../../utils/formatDate'
import SpreadsheetCard from '../../components/cards/SpreadsheetCard'
import useFetch from '../../hooks/useFetch'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import NewSpreadsheetModal from '../../components/modals/NewSpreadsheetModal'
import DuplicateSpreadsheetModal from '../../components/modals/DuplicateSpreadsheetModal'
import SpreadsheetSettingsModal from '../../components/modals/SpreadsheetSettingsModal'
import DeleteSpreadsheetModal from '../../components/modals/DeleteSpreadsheetModal'
import ArchiveSpreadsheetModal from '../../components/modals/ArchiveSpreadsheetModal'
import { editSpreadsheet } from '../../services/spreadsheet'
import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, GridCellKind, GridColumnIcon } from '@glideapps/glide-data-grid';
import { toast } from 'react-toastify';
import { LuNetwork, LuSheet, LuTextCursorInput } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa'
import { TfiGallery } from 'react-icons/tfi'
import { TbMessageChatbot } from 'react-icons/tb'
import { AiOutlineEye, AiOutlineSave } from 'react-icons/ai'
import { MdOutlineDownloadForOffline } from 'react-icons/md'
import { IoArrowUndoCircleOutline, IoArrowRedoCircleOutline, IoCheckmarkCircle, IoAddCircleOutline } from 'react-icons/io5'
import { CiExport } from 'react-icons/ci'
import { GrAddCircle } from 'react-icons/gr'
import NewFieldModal from '../../components/modals/NewFieldModal'
import Papa from 'papaparse'
import getIdFromName from '../../utils/getIdFromName'
import exportFromJSON from 'export-from-json'
import EditFieldsModal from '../../components/modals/EditFieldsModal'


const Spreadsheet = () => {

  const [showDuplicateSpreadsheetModal, setShowDuplicateSpreadsheetModal] = useState(false)
  const [showSpreadsheetSettingsModal, setShowSpreadsheetSettingsModal] = useState(false)
  const [showDeleteSpreadsheetModal, setShowDeleteSpreadsheetModal] = useState(false)
  const [showArchiveSpreadsheetModal, setShowArchiveSpreadsheetModal] = useState(false)
  const [showNewFieldModal, setShowNewFieldModal] = useState(false)
  const [showEditFieldsModal, setShowEditFieldsModal] = useState(false)

  const { workspaceId } = useParams()
  const { spreadsheetId } = useParams()
  const location = useLocation()

  const [showOptions, setShowOptions] = useState(false)
  const [showViewDropdown, setShowViewDropdown] = useState(false)

  const [saving, setSaving] = useState(false)
  const [cellChanged, setCellChanged] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const { data, loading, error } = useFetch(`/spreadsheet/${spreadsheetId}`, [spreadsheetId, refresh])

  const currentWorkspace = useFetch(`/workspace/${workspaceId}`, [workspaceId])

  const [spreadsheetData, setSpreadsheetData] = useState(null)

  const importRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()



  const getContent = useCallback((cell) => {
    if (spreadsheetData && !loading) {
      const [col, row] = cell;
      const dataRow = spreadsheetData['rows'][row];
      // dumb but simple way to do this
      // const indexes = ["email", "first-name", "last-name", "photo", "opt-in", "title", "more-info", "manager", "hired", "level"];
      // console.log(dataRow)
      const indexes = spreadsheetData['columns'].map(_ => _.id)
      const d = dataRow[indexes[col]]
      // console.log(d, indexes[col])
      // if (indexes[col] == 'photo') {
      //   return {
      //     kind: GridCellKind.Image,
      //     allowOverlay: true,
      //     displayData: [d],
      //     data: [d],
      //   };
      // }
      // if (indexes[col] == 'opt-in') {
      //   return {
      //     kind: GridCellKind.Boolean,
      //     allowOverlay: true,
      //     displayData: d,
      //     data: d,
      //   };
      // }
      // if (indexes[col] == 'more-info') {
      //   return {
      //     kind: GridCellKind.Uri,
      //     allowOverlay: true,
      //     displayData: d,
      //     data: d,
      //   };
      // }
      // if (indexes[col] == 'manager') {
      //   return {
      //     kind: GridCellKind.Drilldown,
      //     allowOverlay: true,
      //     displayData: [{ img: '"https://images.unsplash.com/photo-1687084626949-93a5e1555fcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', text: d }],
      //     data: [{ img: "https://images.unsplash.com/photo-1687084626949-93a5e1555fcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80", text: d }],
      //   };
      // }
      // if (indexes)
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        displayData: d,
        data: d,
      };
    }
  }, [spreadsheetData])

  const handleInsertRow = () => {
    const newRow = {}
    spreadsheetData.columns.forEach((col) => {
      newRow[col['id']] = ''
    })
    setSpreadsheetData({
      ...spreadsheetData,
      rows: [...spreadsheetData.rows, newRow]
    })
  }

  // const data = [
  //   {
  //     "email": "lorem@mail.com",
  //     "first-name": "lorem",
  //     "last-name": "dolor",
  //     "photo": "https://images.unsplash.com/photo-1687084626949-93a5e1555fcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  //     "opt-in": false,
  //     "title": 'Chief lorem dolor',
  //     "more-info": "https://www.sit-amet.com.ng",
  //     "manager": "lorem amet",
  //     "hired": "today",
  //     "level": "level 2"
  //   },
  // ];

  // const columns = [
  //   { title: "Email", id: 'email', editable: true, icon: GridColumnIcon.HeaderString },
  //   { title: "First Name", id: 'first-name', icon: GridColumnIcon.HeaderString },
  //   { title: "Last Name", id: 'last-name', icon: GridColumnIcon.HeaderString },
  //   { title: "Photo", id: 'photo', icon: GridColumnIcon.HeaderImage },
  //   { title: "Opt-In", id: 'opt-in', icon: GridColumnIcon.HeaderBoolean },
  //   { title: "Title", id: 'title', icon: GridColumnIcon.HeaderString },
  //   { title: "More Info", id: 'more-info', icon: GridColumnIcon.HeaderUri },
  //   { title: "Manager", id: 'manager', icon: GridColumnIcon.HeaderReference },
  //   { title: "Hired", id: 'hired', icon: GridColumnIcon.HeaderDate },
  //   { title: "Level", id: 'level' },
  // ];


  const handleImportCsv = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const columns = []
        const duplicateColumns = []
        const rows = []
        Object.keys(results.data[0]).forEach((key) => {
          if (spreadsheetData.columns.findIndex(({ id }) => (getIdFromName(key) == id)) != -1) {
            duplicateColumns.push(getIdFromName(key))
            return
          }
          columns.push({
            title: key,
            id: getIdFromName(key),
            editable: true,
            icon: GridColumnIcon.HeaderString,
            type: 'text',
          })
        })
        results.data.forEach((obj) => {
          const row = {}
          Object.entries(obj).forEach(([key, value]) => {
            row[getIdFromName(key)] = value
          })
          rows.push(row)
        })

        const oldRows = spreadsheetData.rows
        oldRows.map((row) => {
          const newRow = row
          columns.forEach((col) => {
            newRow[col['id']] = ''
          })
          return newRow
        })

        const newRows = rows
        newRows.map((row) => {
          const newRow = row
          spreadsheetData.columns.forEach((col) => {
            if (duplicateColumns.findIndex((key) => (key == col['id'])) != -1) {
              return
            }
            newRow[col['id']] = ''
          })
          return newRow
        })

        setSpreadsheetData({
          ...spreadsheetData,
          columns: [...spreadsheetData.columns, ...columns],
          rows: [...oldRows, ...newRows]
        })
      },
    });
  }

  const handleExportCsv = () => {
    const data = []

    spreadsheetData?.rows.forEach((row) => {
      const newRow = {}

      spreadsheetData?.columns.forEach(({ title, id }) => {
        newRow[title] = row[id]
      })

      data.push(newRow)
    })

    const fileName = spreadsheetData?.name
    const exportType = exportFromJSON.types.csv

    exportFromJSON({ data, fileName, exportType })
  }

  useEffect(() => {
    if (data) {
      setSpreadsheetData(data.spreadsheet)
    }
  }, [data])

  useEffect(() => {
    if (!spreadsheetData) return
    (async () => {
      try {
        setSaving(true)
        await editSpreadsheet(spreadsheetData, spreadsheetId)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setSaving(false)
      }
    })()
  }, [spreadsheetData, cellChanged])

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
        <div className='gap-[15px] flex flex-row flex-wrap items-center relative'>
          <button className={`flex flex-row items-center p-2 border-solid border-gray-200  ${showViewDropdown ? 'border-[1px]' : 'border-0'}  rounded-md gap-2`} onClick={() => {
            setShowViewDropdown(!showViewDropdown)
          }}>
            <IoAddCircleOutline /> <span>Add View</span>
          </button>
          <Button className='bg-[#1ABFAB] text-white dark:text-gray-900   block' type='button' onClick={() => {
          }}>
            <HiDownload className='mr-2 text-lg ' />
            <span>
              Share & Embed
            </span>
          </Button>
          <button className=' text-gray-900 dark:text-white flex items-center' type='button' onClick={() => {
            setShowNewFieldModal(true)
          }}>
            <HiOutlinePlusCircle className='mr-2 text-lg ' />
            <span>
              Add a New Field
            </span>
          </button>

          {
            showViewDropdown &&
            <div className='absolute w-3/4 bg-white dark:bg-gray-700 rounded-[6px] top-12 shadow-md border-solid border-gray-200 border-[1px] text-gray-700 dark:text-white p-3  z-50' onClick={() => {
              setShowViewDropdown(false)
            }}>
              <p className='text-gray-400 font-medium dark:text-white mb-4 text-xs lg:text-[14px]'>
                Data Views
              </p>
              <div className='w-full'>
                {
                  [
                    {
                      title: 'Spreadsheet',
                      icon: <LuSheet />
                    },
                    {
                      title: 'Forms',
                      icon: <FaWpforms />
                    },
                    {
                      title: 'Gallery',
                      icon: <TfiGallery />
                    },
                  ].map(({ title, icon }) => (
                    <div className='flex items-center justify-between w-full mb-4 font-medium'>
                      <div className='flex items-center gap-1'>
                        {icon}
                        <span className='text-xs lg:text-[14px]'>
                          {currentWorkspace.data?.workspace?.name} {title}
                        </span>
                        {
                          title == 'Spreadsheet' &&
                          <div className='text-[10px] lg:text-xs text-[#1ABFAB] flex flex-row items-center gap-1 ml-2'>
                            <FiCheckCircle />
                            <span className=''>
                              Active
                            </span>
                          </div>
                        }
                      </div>
                      <button className='flex flex-row gap-1 text-gray-500 dark:text-white items-center'>
                        <IoAddCircleOutline /> <span className='text-[10px] lg:text-xs '>Add View</span>
                      </button>
                    </div>
                  ))
                }

              </div>
              <p className='text-gray-400 font-medium dark:text-white my-4 text-xs lg:text-[14px]'>
                Coming Soon
              </p>
              <div className='w-full'>
                {
                  [
                    {
                      title: 'Automation',
                      icon: <LuNetwork />
                    },
                    {
                      title: 'AI Chat',
                      icon: <TbMessageChatbot />
                    },
                  ].map(({ title, icon }) => (
                    <div className='flex items-center justify-between w-full mb-4 font-medium'>
                      <div className='flex items-center gap-1'>
                        {icon}
                        <span className='text-xs lg:text-[14px]'>
                          {currentWorkspace.data?.workspace?.name} {title}
                        </span>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          }
        </div>

      </div>

      <div className='my-[12px] flex items-center gap-[16px]'>
        <LuSheet />
        <p className='text-base lg:text-lg font-semibold text-gray-900 dark:text-white'>
          {spreadsheetData?.name}
        </p>
      </div>

      {
        loading ?
          <Spinner aria-label="Fetching spreadsheets..." />
          :
          spreadsheetData ?
            <div className='p-2 gap-[24px] rounded-md' style={{ boxShadow: '0 0 4px rgba(0,0,0,0.3)', }}>
              <div className='flex flex-row gap-2 flex-wrap'>
                {
                  ['spreadsheet', 'form'].map((link) => (
                    <Link to={`/workspace/${workspaceId}/${link}`} className={` capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 ${location.pathname.includes(link) && 'bg-gray-200 dark:bg-gray-700'} text-[10px] lg:text-xs`}>
                      {
                        link == 'spreadsheet' ?
                          <LuSheet />
                          :
                          link == 'form' ?
                            <FaWpforms />
                            :
                            ''
                      }
                      {link.split('-').join(' ')}
                      {
                        link != 'spreadsheet' && <span className=' bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[8px] lg:text-[10px] p-0.5 rounded-md'>Soon</span>
                      }
                    </Link>
                  ))
                }
              </div>
              <div className='flex flex-row gap-2 flex-wrap border-solid border-0 border-t-2 border-gray-200 border-b-2'>
                <input type='file' ref={importRef} accept=".csv" onChange={handleImportCsv} className='hidden' />
                <div className={`capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 text-[10px] lg:text-xs`} >
                  {
                    saving ?
                      <>  <span>Autosaving...</span> <Spinner size={'xs'} /> </>
                      :
                      <>
                        <span>
                          Changes saved
                        </span>
                        <IoCheckmarkCircle />
                      </>
                  }
                </div>
                {

                  ['undo', 'redo', 'insert row', 'import csv', 'export csv', 'edit fields'].map((btn) => (
                    <button key={btn} className={`rounded-md capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 text-[10px] lg:text-xs`} onClick={
                      (e) => {
                        e.preventDefault()
                        switch (btn) {
                          case 'insert row':
                            handleInsertRow()
                            break;
                          case 'import csv':
                            importRef.current.click();
                            break;
                          case 'export csv':
                            handleExportCsv()
                            break;
                          case 'edit fields':
                            setShowEditFieldsModal(true)
                            break;
                          default:
                            break;
                        }
                      }
                    }>
                      {
                        btn == 'undo' ?
                          <IoArrowUndoCircleOutline />
                          :
                          btn == 'redo' ?
                            <IoArrowRedoCircleOutline />
                            :
                            btn == 'insert row' ?
                              <GrAddCircle />
                              :
                              btn == 'import csv' ?
                                <MdOutlineDownloadForOffline />
                                :
                                btn == 'export' ?
                                  <CiExport />
                                  :
                                  btn == 'edit fields' ?
                                    <LuTextCursorInput />
                                    :
                                    ''
                      }
                      {btn}
                    </button>
                  ))
                }
              </div>
              <DataEditor className='w-full min-h-full data-editor' getCellContent={getContent} columns={spreadsheetData?.columns} rows={spreadsheetData?.rows?.length} getCellsForSelection={true}
                keybindings={{ search: true }} onCellEdited={(i, j) => {
                  const dataa = spreadsheetData
                  dataa.rows[i[1]][dataa.columns[i[0]]['id']] = j.data
                  setSpreadsheetData(dataa)
                  setCellChanged(!cellChanged)
                }} />
            </div>
            :
            <div className='flex flex-col items-center py-[40px]'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                Spreadsheet not found
              </h3>
              <div className='w-[250px] h-[155px] my-[20px]'>
                <img src={emptyDashboardIllustration} className='h-full w-full object-cover' />
              </div>
              <Link to={`/workspace/${workspaceId}/spreadsheet`} className='bg-[#1ABFAB] text-white dark:text-gray-900 flex items-center p-2 rounded-md' >
                <LuSheet className='mr-2 text-lg ' />
                <span>
                  All spreadsheets
                </span>
              </Link>
            </div>
      }

      <DuplicateSpreadsheetModal showModal={showDuplicateSpreadsheetModal} setShowModal={setShowDuplicateSpreadsheetModal} spreadsheet={spreadsheetData} />
      <SpreadsheetSettingsModal showModal={showSpreadsheetSettingsModal} setShowModal={setShowSpreadsheetSettingsModal} spreadsheet={spreadsheetData} refresh={refresh} setRefresh={setRefresh} />
      <DeleteSpreadsheetModal showModal={showDeleteSpreadsheetModal} setShowModal={setShowDeleteSpreadsheetModal} id={spreadsheetData?._id} />
      <ArchiveSpreadsheetModal showModal={showArchiveSpreadsheetModal} setShowModal={setShowArchiveSpreadsheetModal} id={spreadsheetData?._id} />
      <NewFieldModal showModal={showNewFieldModal} setShowModal={setShowNewFieldModal} id={spreadsheetData?._id} columns={spreadsheetData?.columns} rows={spreadsheetData?.rows} refresh={refresh} setRefresh={setRefresh} />
      <EditFieldsModal showModal={showEditFieldsModal} setShowModal={setShowEditFieldsModal} spreadsheetData={spreadsheetData} refresh={refresh} setRefresh={setRefresh} setSpreadsheetData={setSpreadsheetData} />

    </MainContainer >
  )
}

export default Spreadsheet