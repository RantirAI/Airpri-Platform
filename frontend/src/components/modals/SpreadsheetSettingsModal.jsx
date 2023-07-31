import { Button, Dropdown, Label, Modal, Spinner, Textarea, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { getOrgMembers } from '../../services/user'
import { editSpreadsheet } from '../../services/spreadsheet'
import { BsCheckLg } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SpreadsheetSettingsModal = ({ showModal, setShowModal, spreadsheet, refresh, setRefresh }) => {

    const nameRef = useRef(null)
    const descriptionRef = useRef(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const editedSpreadsheet = await editSpreadsheet({ name: nameRef.current.value, description: descriptionRef.current.value}, spreadsheet._id)
            toast.success('Spreadsheet successfully updated!')
            nameRef.current.value = ''
            descriptionRef.current.value = ''
            setShowModal(false)
            setRefresh(!refresh)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }


    useEffect(() => {
        if (showModal) {
            nameRef.current.value = spreadsheet.name
            descriptionRef.current.value = spreadsheet.description
        }
    }, [showModal])


    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='md'>
            <Modal.Header>Spreadsheet Settings</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        id='spreadsheet-name'
                        placeholder='Set a Spreadsheet Name'
                        required
                        type='text'
                        ref={nameRef}
                    />


                    <div className="mb-2 block">
                        <Label
                            htmlFor="spreadsheet-description"
                            value="Give a Spreadsheet Description"
                            className='text-[14px] lg:text-base font-semibold text-gray-900 my-[20px] block'
                        />
                    </div>
                    <Textarea
                        id="spreadsheet-description"
                        placeholder="I made some wireframes that we would like you to follow since we are building it in Rantir’s next generation spreadsheet & AI module that is open to the public... "
                        required
                        rows={4}
                        ref={descriptionRef}
                    />
                    <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-full' type='submit' onClick={handleSubmit}>
                        {
                            submitting ?
                                <>
                                    <Spinner aria-label="Creating Spreadsheet" />
                                    <span className="pl-3">
                                        Loading...
                                    </span>
                                </>
                                :
                                <>
                                    <TbClipboardList className='mr-2 text-lg ' />
                                    <span>
                                        Update Spreadsheet
                                    </span>
                                </>
                        }
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default SpreadsheetSettingsModal