import { Button, Modal, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { TbClipboardList } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { editSpreadsheet } from '../../services/spreadsheet'
import fieldTypes from '../../utils/fieldTypes'
import getIdFromName from '../../utils/getIdFromName'
import FieldTypeIcon from '../FieldTypeIcon'


const Field = ({ col, cols, setCols, rows, setRows }) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [fieldType, setFieldType] = useState(null)
    const [fieldName, setFieldName] = useState('')

    useEffect(() => {
        setFieldType(fieldTypes[fieldTypes.findIndex((_) => (_.value == col.type))])
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
                        <FieldTypeIcon type={fieldType?.label} />
                        <span> {fieldType?.label || 'Select field type'} </span>
                    </p>
                    {showDropdown ? <FiChevronUp /> : <FiChevronDown />}
                </p>
                {
                    showDropdown &&
                    <div className='w-full max-h-[90px] shadow-md rounded-md right-0 left-0 top-[42px] overflow-y-scroll flex flex-col absolute  bg-white z-50'>
                        {
                            fieldTypes.map((ft) => (
                                <button key={ft.label} className='p-2 flex flex-row justify-between w-full' onClick={() => {
                                    setFieldType(ft)
                                    const all = cols
                                    const index = cols.findIndex((_) => _.id == col.id)
                                    all[index]['icon'] = ft.icon
                                    all[index]['type'] = ft.value
                                    all[index]['label'] = ft.label
                                    setCols(all)
                                }} >
                                    <p className='flex flex-row gap-1 items-center'>
                                        <FieldTypeIcon type={ft.label} />
                                        <span>
                                            {ft.label}
                                        </span>
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
                setFieldName(e.target.value)
                const all = [...cols]
                const index = all.findIndex((_) => _.id == col.id)
                all[index]['title'] = e.target.value
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

            const finalRows = []
            rows.forEach((__) => {
                const newRow = {}
                Object.entries(__).forEach((item) => {
                    const colIndex = cols.findIndex((col) => col.id == item[0])
                    if (getIdFromName(cols[colIndex]['title']) == item[0]) {
                        newRow[item[0]] = item[1]
                    } else {
                        newRow[getIdFromName(cols[colIndex]['title'])] = item[1]
                    }
                })
                finalRows.push(newRow)
            })

            const finalCols = cols.map((_) => {
                return ({ ..._, id: getIdFromName(_.title) })
            })

            await editSpreadsheet({
                columns: finalCols, rows: finalRows
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
                        <Field key={col['id']} col={col} cols={cols} setCols={setCols} rows={rows} setRows={setRows} spreadsheetData={spreadsheetData} />
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