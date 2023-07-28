import { Button, Dropdown, Label, Modal, Spinner, Textarea, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { getOrgMembers } from '../../services/user'
import { createSpreadsheet } from '../../services/spreadsheet'
import { BsCheckLg } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NewSpreadsheetModal = ({showModal, setShowModal}) => {
    const {workspace} = useSelector(state => state.workspace)

    const nameRef = useRef(null)
    const descriptionRef = useRef(null)
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const spreadsheet = await createSpreadsheet({ name: nameRef.current.value, description: descriptionRef.current.value, workspaceId: workspace._id })
            toast.success('Spreadsheet successfully created!')
            nameRef.current.value = ''
            descriptionRef.current.value = ''
            setShowModal(false)
            navigate(`/spreadsheet/${spreadsheet._id}`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='md'>
            <Modal.Header>Add a New Spreadsheet</Modal.Header>
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
                                    <Spinner aria-label="Creating spreadsheet" />
                                    <span className="pl-3">
                                        Loading...
                                    </span>
                                </>
                                :
                                <>
                                    <TbClipboardList className='mr-2 text-lg ' />
                                    <span>
                                        Start a New Spreadsheet
                                    </span>
                                </>
                        }
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default NewSpreadsheetModal