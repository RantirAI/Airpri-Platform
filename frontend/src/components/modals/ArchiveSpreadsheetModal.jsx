import { Button, Modal, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { archiveSpreadsheet } from '../../services/spreadsheet';

const ArchiveSpreadsheetModal = ({ showModal, setShowModal, id }) => {
    const [submitting, setSubmitting] = useState(false)

    const navigate = useNavigate()

    const handleArchive = async (e) => {
        try {
            e.preventDefault()
            setSubmitting(true)
            await archiveSpreadsheet(id)
            setShowModal(false)
            toast.info('Spreadsheet archived!')
            navigate('/spreadsheet')
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
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to archive this spreadsheet?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={handleArchive}>
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
                        <Button color="gray" onClick={() => setShowModal((false))}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default ArchiveSpreadsheetModal