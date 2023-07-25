import { Button, Modal, Spinner } from 'flowbite-react'
import React, { useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const NewFieldModal = ({showModal, setShowModal, id}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            setShowModal(false)
            toast.success('Field added')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='3xl'>
            <Modal.Header>Add new Fields to the Spreadsheet </Modal.Header>
            <Modal.Body>
                <p className='text-sm font-normal flex justify-between'>
                    <span className='text-gray-600'>
                        Drag or check the fields you want to add.
                    </span>
                    <span className='text-gray-900 font-semibold'>
                        Then, edit the Name to change the top spreadsheet attribute
                    </span>
                </p>
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
                                    <TbClipboardList className='mr-2 text-xl ' />
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