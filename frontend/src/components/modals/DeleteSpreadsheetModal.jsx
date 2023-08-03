import { Button, Modal, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteSpreadsheet } from '../../services/spreadsheet';

const DeleteSpreadsheetModal = ({showModal, setShowModal, id}) => {
    const [submitting, setSubmitting] = useState(false)
    const {workspaceId} = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDelete = async (e) => {
        try {
            e.preventDefault()
            setSubmitting(true)
            await deleteSpreadsheet(id)
            toast.info('Spreadsheet deleted!')
            setShowModal(false)
            navigate(`/workspace/${workspaceId}/spreadsheet`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal dismissible show={showModal} size="md" popup onClose={() => setShowModal(false)}>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-[14px] lg:text-base font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this spreadsheet?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={handleDelete}>
                            {
                                submitting ?
                                    <>
                                        <Spinner aria-label="Deleting spreadsheet" />
                                        <span className="pl-3">
                                            Loading...
                                        </span>
                                    </>
                                    :
                                    "Yes, I'm sure"
                            }
                        </Button>
                        <Button color="gray" onClick={() => setShowModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default DeleteSpreadsheetModal