import { GridCellKind, GridColumnIcon } from '@glideapps/glide-data-grid'
import { Button, Dropdown, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineDelete, AiOutlineLink } from 'react-icons/ai'
import { BsCheckLg, BsTextIndentLeft } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { TbCalendarTime, TbClipboardList } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { editSpreadsheet } from '../../services/spreadsheet'
import getIdFromName from '../../utils/getIdFromName'
import { ImListNumbered, ImTextColor } from 'react-icons/im'
import { CiTextAlignLeft } from 'react-icons/ci'
import { HiOutlineMailOpen } from 'react-icons/hi'
import { BiSolidLockAlt } from 'react-icons/bi'
import { GoNumber } from 'react-icons/go'
import { LuCheckSquare, LuFileJson } from 'react-icons/lu'
import { MdDateRange, MdFormatColorFill } from 'react-icons/md'

const types = [
    {
        icon: GridColumnIcon.HeaderString,
        value: GridCellKind.Text,
        label: 'Text'
    },
    {
        icon: GridColumnIcon.HeaderTextTemplate,
        value: GridCellKind.Text,
        label: 'Long Text'
    },
    {
        icon: GridColumnIcon.HeaderTextTemplate,
        value: GridCellKind.Text,
        label: 'Rich Text'
    },
    {
        icon: GridColumnIcon.HeaderUri,
        value: GridCellKind.Uri,
        label: 'Link/Slug'
    },
    {
        icon: GridColumnIcon.HeaderEmail,
        value: GridCellKind.Text,
        label: 'Email'
    },
    {
        icon: GridColumnIcon.HeaderCode,
        value: GridCellKind.Protected,
        label: 'Password'
    },
    {
        icon: GridColumnIcon.HeaderNumber,
        value: GridCellKind.Number,
        label: 'Number'
    },
    {
        icon: GridColumnIcon.HeaderJoinStrings,
        value: GridCellKind.Bubble,
        label: 'Enumeration'
    },
    {
        icon: GridColumnIcon.HeaderBoolean,
        value: GridCellKind.Boolean,
        label: 'Boolean'
    },
    {
        icon: GridColumnIcon.HeaderImage,
        value: GridCellKind.Custom,
        label: 'Color'
    },
    {
        icon: GridColumnIcon.HeaderDate,
        value: GridCellKind.Custom,
        label: 'Date'
    },
    {
        icon: GridColumnIcon.HeaderTime,
        value: GridCellKind.Custom,
        label: 'Time'
    },
    {
        icon: GridColumnIcon.HeaderCode,
        value: GridCellKind.Custom,
        label: 'JSON'
    },
]

const renderIcon = (type) => (
    <>
        {
            type == 'Text' ?
                <ImTextColor />
                :
                type == 'Long Text' ?
                    <CiTextAlignLeft />
                    :
                    type == 'Rich Text' ?
                        <BsTextIndentLeft />
                        :
                        type == 'Link/Slug' ?
                            <AiOutlineLink />
                            :
                            type == 'Email' ?
                                <HiOutlineMailOpen />
                                :
                                type == 'Password' ?
                                    <BiSolidLockAlt />
                                    :
                                    type == 'Number' ?
                                        <GoNumber />
                                        :
                                        type == 'Enumeration' ?
                                            <ImListNumbered />
                                            :
                                            type == 'Boolean' ?
                                                <LuCheckSquare />
                                                :
                                                type == 'Color' ?
                                                    <MdFormatColorFill />
                                                    :
                                                    type == 'Date' ?
                                                        <MdDateRange />
                                                        :
                                                        type == 'Time' ?
                                                            <TbCalendarTime />
                                                            :
                                                            type == 'JSON' ?
                                                                < LuFileJson />
                                                                :
                                                                ''
        }
    </>
)

const Field = ({ col, cols, setCols, rows, setRows }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [fieldType, setFieldType] = useState(null)
    const [fieldName, setFieldName] = useState('')

    useEffect(() => {
        setFieldType(types[types.findIndex((_) => (_.value == col.type))])
        setFieldName(col.title)
    }, [cols, col])



    return (
        <div className={`border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal relative cursor-pointer  mb-2 flex justify-between `}>
            <div className={`border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal relative cursor-pointer min-w-[150px]`} onClick={() => {
                setShowDropdown(!showDropdown)
            }}>

                <p
                    className=' flex flex-row items-center justify-between'
                >
                    <p className='flex flex-row items-center gap-1'>
                        {renderIcon(fieldType?.label)}
                        <span> {fieldType?.label || 'Select field type'} </span>
                    </p>
                    {showDropdown ? <FiChevronUp /> : <FiChevronDown />}
                </p>
                {
                    showDropdown &&
                    <div className='w-full max-h-[90px] shadow-md rounded-md right-0 left-0 top-[42px] overflow-y-scroll flex flex-col absolute  bg-white z-50'>
                        {
                            types.map((ft) => (
                                <button className='p-2 flex flex-row justify-between w-full' onClick={() => {
                                    setFieldType(ft)
                                    const all = cols
                                    const index = cols.findIndex((_) => _.id == col.id)
                                    all[index]['icon'] = ft.icon
                                    all[index]['type'] = ft.value
                                    setCols(all)
                                }} >
                                    <p className='flex flex-row gap-1 items-center'>
                                        {renderIcon(ft.label)}
                                        {ft.label}
                                    </p>
                                    {
                                        ft.label == fieldType?.label ? <BsCheckLg /> : ''
                                    }
                                </button>
                            ))
                        }
                    </div>
                }
            </div>
            <input type={'text'} className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal relative cursor-pointer flex ' value={fieldName} onChange={(e) => {
                const all = cols
                const index = cols.findIndex((_) => _.id == col.id)
                all[index]['title'] = e.target.value
                setFieldName(e.target.value)
                setCols(all)
                all[index]['id'] = getIdFromName(e.target.value)
            }} />

            <button onClick={(e) => {
                e.preventDefault()
                setCols(cols.filter((_) => (
                    _.id != col.id
                )))
                const formerRows = [...rows]
                const newRows = []
                formerRows.forEach((row) => {
                    const newRow = {}
                    Object.entries(row).forEach((item) => {
                        if (col.id != item[0]) {
                            newRow[item[0]] = item[1]
                        }
                    })
                    newRows.push(newRow)
                })
                setRows(newRows)
            }} className='text-black'>
                <AiOutlineDelete />
            </button>
        </div>
    )
}


const EditFieldsModal = ({ showModal, setShowModal, spreadsheetData, refresh, setRefresh }) => {
    const [cols, setCols] = useState([])
    const [rows, setRows] = useState([])
    
    
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            await editSpreadsheet({
                columns: cols,
                rows
            }, spreadsheetData?._id)
            setShowModal(false)
            setRefresh(!refresh)
            toast.success('Fields successfully edited')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        setCols(spreadsheetData?.columns)
        setRows(spreadsheetData?.rows)
    }, [spreadsheetData])


    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='lg' >
            <Modal.Header>Edit fields in {spreadsheetData?.name} </Modal.Header>
            <Modal.Body>
                {
                    cols?.map((col, index) => (
                        <Field col={col} cols={cols} setCols={setCols} rows={rows} setRows={setRows} spreadsheetData={spreadsheetData} />
                    ))
                }

                <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-full' type='submit' onClick={handleSubmit}>
                    {
                        submitting ?
                            <>
                                <Spinner aria-label="Creating workspace" />
                                <span className="pl-3">
                                    Loading...
                                </span>
                            </>
                            :
                            <>
                                <TbClipboardList className='mr-2 text-lg ' />
                                <span>
                                    Save Spreadsheet Settings
                                </span>
                            </>
                    }
                </Button>

            </Modal.Body>
        </Modal>
    )
}

export default EditFieldsModal