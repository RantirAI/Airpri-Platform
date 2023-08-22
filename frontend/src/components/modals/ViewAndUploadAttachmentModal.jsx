import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { TbClipboardList } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { autosave, editSpreadsheet } from '../../services/spreadsheet'
import fieldTypes from '../../utils/fieldTypes'
import FieldTypeIcon from '../FieldTypeIcon'
import { AiFillSave } from 'react-icons/ai'
import { MdOutlinePreview } from 'react-icons/md'
import Axios from '../../config/axios'
import FileViewer from 'react-file-viewer-extended';



const ViewAndUploadAttachmentModal = ({ cell, setCell, showModal, spreadsheetData, setSpreadsheetData, setSaving }) => {
    const [showFileViewer, setShowFileViewer] = useState(false)
    const fileRef = useRef(null)
    const { spreadsheetId } = useParams()
    let link = ''
    if (spreadsheetData && cell) {
        link = spreadsheetData.rows[cell[1]][spreadsheetData.columns[cell[0]]['id']]
    }


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            console.log(fileRef.current.files[0], 'na ham')
            const formData = new FormData()
            formData.append('file', fileRef.current.files[0])
            const response = await Axios.post('spreadsheet/upload-s3', formData)
            const link = response.data.location
            const dataa = spreadsheetData
            dataa.rows[cell[1]][dataa.columns[cell[0]]['id']] = link
            setSpreadsheetData(dataa)
            setSaving(true)
            await autosave({ cell: { index: cell, data: link } }, spreadsheetId)
            setCell(null)
            toast.success('Attachment added')
        } catch (error) {
            toast.error(error?.message || error)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        if (fileRef?.current) {
            fileRef.current.value = ''
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.className = fileRef.current.className;
            fileRef.current.parentNode.replaceChild(newFileInput, fileRef.current);
            fileRef.current = newFileInput;
        }
    }, [cell])

    return (
        <Modal dismissible={!submitting} show={showModal} onClose={() => {
            setCell(null)
            setShowFileViewer(false)
        }} size='5xl' >
            <Modal.Header>View and Upload attachment</Modal.Header>
            <Modal.Body>
                <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mb-8 flex justify-center w-max mx-auto' type='button' onClick={() => {
                    setShowFileViewer(!showFileViewer)
                }} size='lg'>
                    <MdOutlinePreview className='mr-2 text-lg ' />
                    <span>
                        {
                            showFileViewer ? 'Close file' : 'View file'
                        }
                    </span>
                </Button>

                {
                    showFileViewer &&
                    <div className="overflow-y-auto max-h-[50vh]">
                        {
                            link?.endsWith('docx') ?
                                <FileViewer fileType="docx" filePath={link} />
                                :
                                link?.endsWith('pdf') ?
                                    <FileViewer fileType="pdf" filePath={link} />
                                    :
                                    (link?.endsWith('png') || link?.endsWith('jpg') || link?.endsWith('jpeg')) ?
                                        <img src={link} className='w-full h-full' />
                                        :
                                        null

                        }
                    </div>
                }


                <form onSubmit={handleSubmit} className='border-solid border-gray-200 border-0 border-t-2 pt-8 mt-8'>
                    <TextInput
                        id='file'
                        placeholder='Select only pdf/doc/img file'
                        required
                        ref={fileRef}
                        type='file'
                        className='!p-0 text-red-400'
                    />
                    <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-max' type='submit' onClick={handleSubmit}>
                        {
                            submitting ?
                                <>
                                    <Spinner aria-label="Creating workspace" />
                                    <span className="pl-3">
                                        Saving...
                                    </span>
                                </>
                                :
                                <>
                                    <AiFillSave className='mr-2 text-lg ' />
                                    <span>
                                        Save Attachment
                                    </span>
                                </>
                        }
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default ViewAndUploadAttachmentModal