import { Button, Dropdown, Label, Modal, Spinner, Textarea, TextInput, ToggleSwitch } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { getOrgMembers } from '../../services/user'
import { editSpreadsheet } from '../../services/spreadsheet'
import { BsCheckLg } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillSave } from 'react-icons/ai'
import { shareSpreadsheet } from '../../services/share'
import { IoCopy } from 'react-icons/io5'
import { ImEmbed2 } from 'react-icons/im'
import { GrView } from 'react-icons/gr'

const ShareSpreadsheetModal = ({ showModal, setShowModal, id, privateAccess }) => {

    const [link, setLink] = useState('')
    const [publicAccess, setPublicAccess] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLink('')
            setSubmitting(true)
            const spreadsheetId = await shareSpreadsheet(id, { access: publicAccess ? 'public' : 'private' } )
            if (publicAccess) {
                setLink(`https://airpri-platform.vercel.app/share/spreadsheet/${spreadsheetId}`)
                toast.success('Spreadsheet published')
            } else {
                setLink('')
                toast.success('Spreadsheet unpublished')
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleCopyLink = () => {
        const clipBoard = navigator.clipboard;
        clipBoard.writeText(link).then(() => {
            toast.success('Link copied')
        });
    }

    const handleCopyEmbed = () => {
        const clipBoard = navigator.clipboard;
        clipBoard.writeText(`<iframe src="${link}" title="Spreadsheet - Airpri"></iframe>`).then(() => {
            toast.success('Embed code copied')
        });
    }

    useEffect(() => {
        setPublicAccess(!privateAccess)
    }, [privateAccess])

    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='xl'>
            <Modal.Header>Share & Embed the Spreadsheet</Modal.Header>
            <Modal.Body>
                <div className='flex gap-2 items-center'>
                    <div className='flex-1 '>
                        <p className='font-bold text-lg text-gray-900'>
                            Publish and share the link with everyone
                        </p>
                        <p className='text-gray-500 '>
                            This switch means that this is a public spreadsheet
                        </p>
                    </div>
                    <div className='min-w-max min-h-max'>
                        <ToggleSwitch
                            checked={publicAccess}
                            onClick={() => {
                                setPublicAccess(!publicAccess)
                            }}
                            className='min-h-max min-w-max'
                        />
                    </div>

                </div>



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
                                <AiFillSave className='mr-2 text-lg ' />
                                <span>
                                    Save
                                </span>
                            </>
                    }
                </Button>


                {
                    link &&

                    <div>

                        <p className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal mt-5 mb-2'>
                            {link}
                        </p>
                        <div className=' flex items-center gap-4 justify-center p-4'>
                            <button onClick={handleCopyLink} className='gap-2 flex items-center'>
                                <IoCopy />
                                <span>
                                    Copy
                                </span>
                            </button>
                            <button onClick={handleCopyEmbed} className='gap-2 flex items-center'>
                                <ImEmbed2 />
                                <span>
                                    Embed
                                </span>
                            </button>
                            <Link to={link} target='_blank' className='gap-2 flex items-center'>
                                <GrView />
                                <span>
                                    View
                                </span>
                            </Link>

                        </div>

                    </div>
                }


            </Modal.Body>
        </Modal>
    )
}

export default ShareSpreadsheetModal