import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid'
import "@glideapps/glide-data-grid/dist/index.css"
import exportFromJSON from 'export-from-json'
import { Button, Spinner, TextInput } from 'flowbite-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CiExport } from 'react-icons/ci'
import { FaWpforms } from 'react-icons/fa'
import { FiCheckCircle, FiSettings } from 'react-icons/fi'
import { GrAddCircle } from 'react-icons/gr'
import { HiDownload, HiOutlinePlusCircle } from 'react-icons/hi'
import { IoAddCircleOutline, IoArrowRedoCircleOutline, IoArrowUndoCircleOutline, IoCheckmarkCircle } from 'react-icons/io5'
import { LuNetwork, LuSheet, LuTextCursorInput } from 'react-icons/lu'
import { MdOutlineDownloadForOffline } from 'react-icons/md'
import { SlOptionsVertical } from 'react-icons/sl'
import { TbMessageChatbot } from 'react-icons/tb'
import { TfiGallery } from 'react-icons/tfi'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import emptyDashboardIllustration from '../../assets/empty-dashboard-illustration.svg'
import MainContainer from '../../components/layouts/MainContainer'
import ArchiveSpreadsheetModal from '../../components/modals/ArchiveSpreadsheetModal'
import DeleteSpreadsheetModal from '../../components/modals/DeleteSpreadsheetModal'
import DuplicateSpreadsheetModal from '../../components/modals/DuplicateSpreadsheetModal'
import EditFieldsModal from '../../components/modals/EditFieldsModal'
import ImportingCSVModal from '../../components/modals/ImportingCSVModal'
import NewFieldModal from '../../components/modals/NewFieldModal'
import ShareSpreadsheetModal from '../../components/modals/ShareSpreadsheetModal'
import SpreadsheetSettingsModal from '../../components/modals/SpreadsheetSettingsModal'
import Axios from '../../config/axios'
import useFetch from '../../hooks/useFetch'
import authDarkModeLogo from '../../assets/auth-dark-mode-logo.svg'
import Footer from '../../components/layouts/MainContainer/Footer'



const ScrollSpreadsheet = () => {

    const { workspaceId } = useParams()
    const { spreadsheetId } = useParams()
    const location = useLocation()

    const [showOptions, setShowOptions] = useState(false)
    const [showViewDropdown, setShowViewDropdown] = useState(false)

    const [saving, setSaving] = useState(false)
    const [refresh, setRefresh] = useState(false)

    // const { data, loading, error } = useFetch(`/spreadsheet/${spreadsheetId}?page=1`, [spreadsheetId, refresh])

    const [loading, setLoading] = useState(true)
    const [spreadsheetData, setSpreadsheetData] = useState(null)
    const [sharedSpreadsheetData, setSharedSpreadsheetData] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)
    const [currPage, setCurrPage] = useState(1)
    const [endReached, setEndReached] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const bodyRef = useRef()


    const getContent = useCallback((cell) => {
        if (sharedSpreadsheetData && !loading) {
            const [col, row] = cell;
            const dataRow = sharedSpreadsheetData['rows'][row];
            // dumb but simple way to do this
            // const indexes = ["email", "first-name", "last-name", "photo", "opt-in", "title", "more-info", "manager", "hired", "level"];
            // console.log(dataRow)
            const indexes = sharedSpreadsheetData['columns'].map(_ => _.id)
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
    }, [sharedSpreadsheetData])


    const handleScroll = () => {
        console.log('helllooo')
        const divElement = bodyRef.current;
        if (divElement) {
            const scrollableHeight = divElement.scrollHeight;
            const scrollTop = divElement.scrollTop;
            const clientHeight = divElement.clientHeight;

            if ((scrollableHeight - scrollTop === clientHeight)) {
                if (loadingMore) return
                setCurrPage(currPage + 1)
                console.log('fetch new', currPage)
            }
        }
    };

    useEffect(() => {
        const divElement = bodyRef.current
        console.log(divElement)
        if (divElement) {
            divElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (divElement) {
                divElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [spreadsheetId, spreadsheetData]);

    useEffect(() => {
        if (spreadsheetData) {
            setSharedSpreadsheetData({
                ...spreadsheetData, columns: spreadsheetData.columns.map((col) => (
                    { ...col, editable: false }
                ))
            })
        }
    }, [spreadsheetData])



    useEffect(() => {
        (
            async () => {
                if (endReached) return
                try {
                    if (currPage == 1) {
                        setLoading(true)
                    } else {
                        setLoadingMore(true)
                    }
                    // const response = await Axios.get(`/spreadsheet/${spreadsheetId}`)
                    const response = await Axios.get(`/share/spreadsheet/${spreadsheetId}?page=${currPage}`)
                    console.log('fetched new', response.data.spreadsheet)
                    console.log('see old', spreadsheetData)
                    if (spreadsheetData) {
                        console.log({ ...spreadsheetData, rows: [...spreadsheetData.rows, ...response.data.spreadsheet.rows] })
                    }
                    if (spreadsheetData) {
                        setSpreadsheetData({ ...spreadsheetData, rows: [...spreadsheetData.rows, ...response.data.spreadsheet.rows] })
                    } else {
                        console.log(response.data.spreadsheet, 'hereee')
                        setSpreadsheetData(response.data.spreadsheet)
                    }
                    if (response.data.spreadsheet.totalPages == currPage) {
                        setEndReached(true)
                    }
                } catch (error) {
                    toast.error(error?.message || error)
                } finally {
                    setLoading(false)
                    setLoadingMore(false)
                }
            }
        )()
    }, [currPage, spreadsheetId])

    return (
        <div className='bg-[#111928] p-2.5 min-h-screen flex flex-col  overflow-y-auto h-screen' ref={bodyRef}>

            <Link to='/' className='mt-[23px] block mx-auto lg:mx-0 mb-[23px] w-max'>
                <img src={authDarkModeLogo} className='' />
                {/* <img src={authLightModeLogo} className='block dark:hidden' /> */}
            </Link>

            <div className='bg-white rounded-md p-2 mb-2 flex-1'>


                <div className=' bg-white dark:bg-[#111928] flex flex-wrap gap-2 justify-between  items-center mt-[15px] rounded-[8px]'>
                    <div className='my-[12px] flex items-center gap-[16px]'>
                        <LuSheet />
                        <p className='text-base lg:text-lg font-semibold text-gray-900 dark:text-white'>
                            {spreadsheetData?.name}
                        </p>
                    </div>
                    <div className='gap-[20px] flex flex-row flex-wrap items-center relative border border-solid border-gray-200 p-2 rounded-md'>
                        <button className={`flex flex-row items-center p-2  ${showViewDropdown ? 'bg-gray-200' : 'bg-unset'}  rounded-md gap-2`} onClick={() => {
                            setShowViewDropdown(!showViewDropdown)
                        }}>
                            <LuSheet />
                            <p className=''>
                                Spreadsheet
                            </p>
                        </button>
                        <button className=' text-gray-900 dark:text-white flex items-center' type='button' >
                            Sort View
                        </button>

                        {
                            showViewDropdown &&
                            <div className='absolute w-[90%] left-[50%] -translate-x-[50%] bg-white dark:bg-gray-700 rounded-[6px] top-16 shadow-md border-solid border-gray-200 border-[1px] text-gray-700 dark:text-white p-3  z-50' onClick={() => {
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
                                            <div key={title} className='flex items-center justify-between w-full mb-4 font-medium'>
                                                <div className='flex items-center gap-1'>
                                                    {icon}
                                                    <span className='text-xs lg:text-[14px]'>
                                                        {spreadsheet?.name} {title}
                                                    </span>
                                                    {
                                                        title == 'Spreadsheet' &&
                                                        <div className='text-[10px] lg:text-xs text-[#1ABFAB] flex flex-row items-center gap-1 ml-2'>
                                                            <FiCheckCircle />
                                                        </div>
                                                    }
                                                </div>
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
                                            <div key={title} className='flex items-center justify-between w-full mb-4 font-medium'>
                                                <div className='flex items-center gap-1'>
                                                    {icon}
                                                    <span className='text-xs lg:text-[14px]'>
                                                        {spreadsheetData.name} {title}
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
                <p className='mb-2'>
                    {spreadsheetData?.description}
                </p>

                {
                    loading ?
                        <Spinner aria-label="Fetching spreadsheets..." />
                        :
                        sharedSpreadsheetData ?
                            <div className='p-2 gap-[24px] rounded-md' style={{ boxShadow: '0 0 4px rgba(0,0,0,0.3)', }}>
                                {/* <div className='flex flex-row gap-2 flex-wrap'>
                            {
                                ['spreadsheet', 'form'].map((link) => (
                                    <Link key={link} to={`/workspace/${workspaceId}/${link}`} className={` capitalize flex items-center text-gray-700 dark:text-gray-200 gap-2 p-2 ${location.pathname.includes(link) && 'bg-gray-200 dark:bg-gray-700'} text-[10px] lg:text-xs`}>
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
                        </div> */}
                                    <DataEditor width={'100%'} height={(sharedSpreadsheetData?.rows?.length * 40) + 40} className='w-full data-editor' getCellContent={getContent} columns={sharedSpreadsheetData?.columns} rows={sharedSpreadsheetData?.rows?.length} getCellsForSelection={true}
                                        keybindings={{ search: true }}  />
                                    {
                                        loadingMore &&
                                        <div className='flex flex-row items-center justify-center my-1 text-center text-xs text-[14px] text-gray-700'>
                                            <Spinner aria-label="Loading more" />
                                            <span className="pl-3">
                                                Loading...please wait.
                                            </span>
                                        </div>
                                    }
                                    {
                                        endReached &&
                                        <p className='text-center text-xs text-[14px] my-1 italic text-gray-700'>
                                            The end...
                                        </p>
                                    }
                            </div>
                            :
                            <div className='flex flex-col items-center py-[40px]'>
                                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                                    Spreadsheet not found
                                </h3>
                                <div className='w-[250px] h-[155px] my-[20px]'>
                                    <img src={emptyDashboardIllustration} className='h-full w-full object-cover' />
                                </div>
                                <Link to={`/`} className='bg-[#1ABFAB] text-white dark:text-gray-900 flex items-center p-2 rounded-md' >
                                    <LuSheet className='mr-2 text-lg ' />
                                    <span>
                                        Home
                                    </span>
                                </Link>
                            </div>
                }
            </div>

            <Footer />

        </div >
    )
}

export default ScrollSpreadsheet