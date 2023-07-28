import { GridCellKind, GridColumnIcon } from '@glideapps/glide-data-grid'
import { Button, Dropdown, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { TbClipboardList } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { editSpreadsheet } from '../../services/spreadsheet'

const NewFieldModal = ({ showModal, setShowModal, id, columns, rows }) => {
    const fieldNameRef = useRef(null)
    const [fieldType, setFieldType] = useState(null)

    const [showDropdown, setShowDropdown] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            if (columns.find((col) => (
                col.title.toLowerCase() == fieldNameRef.current.value.toLowerCase()
            ))) {
                throw new Error('Field name exists!')
            }
            if (!fieldType) {
                throw new Error('Select field type!')
            }
            const newRows = rows
            newRows.forEach((row) => {
                row[fieldNameRef.current.value.toLowerCase().split(' ').join('-')] = ''
            })
            await editSpreadsheet({
                columns: [...columns, {
                    title: fieldNameRef.current.value,
                    id: fieldNameRef.current.value.toLowerCase().split(' ').join('-'),
                    editable: true,
                    icon: fieldType?.icon,
                    type: fieldType?.value
                }],
                rows: newRows
            }, id)
            setShowModal(false)
            toast.success('Field added')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='md' >
            <Modal.Header>Add new Field to the Spreadsheet </Modal.Header>
            <Modal.Body>
                <TextInput
                    id='field-name'
                    placeholder='Set Field Name'
                    required
                    type='text'
                    ref={fieldNameRef}
                />

                <div className="mb-2 block">
                    <Label
                        htmlFor="field-type"
                        value="Field Type"
                        className='text-[14px] lg:text-base font-semibold text-gray-900 my-[20px] block'
                    />
                </div>

                <div className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal relative cursor-pointer z-30 mb-20' onClick={() => {
                    setShowDropdown(!showDropdown)
                }}>

                    <p
                        className='z-20 flex flex-row items-center justify-between'
                    >
                        <span> {fieldType?.label || 'Select field type'} </span>{showDropdown ? <FiChevronUp /> : <FiChevronDown />}
                    </p>
                    {
                        showDropdown &&
                        <div className='w-full max-h-[130px] shadow-md rounded-md right-0 left-0 top-[42px] overflow-y-scroll flex flex-col absolute z-30 bg-white'>
                            {
                                [
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
                                ].map((ft) => (
                                    <button className='p-2 flex flex-row justify-between' onClick={() => {
                                        setFieldType(ft)
                                    }} >
                                        {ft.label}
                                        {
                                            ft.label == fieldType?.label ? <BsCheckLg /> : ''
                                        }
                                    </button>
                                ))
                            }
                        </div>
                    }
                </div>
                <form onSubmit={handleSubmit}>
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
                                        Save & Add Content
                                    </span>
                                </>
                        }
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default NewFieldModal