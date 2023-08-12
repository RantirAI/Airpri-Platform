import { Modal, Spinner } from 'flowbite-react';

const ImportingCSVModal = ({ showModal }) => {

    return (
        <Modal show={showModal} size="sm" popup >
            <Modal.Body className='p-0'>
                <div className="text-center p-5">
                    <h3 className="text-[14px] lg:text-base font-normal text-gray-500 dark:text-gray-400">
                        <Spinner aria-label="Importing CSV spreadsheet" />
                        <span className="pl-3">
                            Importing CSV...
                        </span>
                    </h3>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default ImportingCSVModal