import { Button, Dropdown, Modal, Spinner, TextInput, ToggleSwitch } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillSave } from 'react-icons/ai'
import { BsCheckLg } from 'react-icons/bs'
import { GrView } from 'react-icons/gr'
import { ImEmbed2 } from 'react-icons/im'
import { IoCopy } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { inviteMember, shareWorkspace } from '../../services/share'
import { getOrgMembers } from '../../services/user'

const ShareWorkspaceModal = ({ showModal, setShowModal, workspace }) => {

    const [activeForm, setActiveForm] = useState('share')

    const [link, setLink] = useState('')
    const [publicAccess, setPublicAccess] = useState(null)

    const [orgMembers, setOrgMembers] = useState([])
    const [invitee, setInvitee] = useState('')
    const inviteeRef = useRef(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const handleShare = async (e) => {
        e.preventDefault()
        try {
            setLink('')
            setSubmitting(true)
            const workspaceId = await shareWorkspace(workspace._id, { access: publicAccess ? 'public' : 'private' })
            if (publicAccess) {
                setLink(`https://airpri-platform.vercel.app/share/workspace/${workspaceId}`)
                toast.success('Workspace published')
            } else {
                setLink('')
                toast.success('Workspace unpublished')
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleInvite = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const workspaceId = await inviteMember(workspace._id, { invitee : invitee || inviteeRef?.current?.value })
            toast.success(`${invitee || inviteeRef?.current?.value} successfully invited to ${workspace.name}`)
            setShowModal(false)
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
        clipBoard.writeText(`<iframe src="${link}" title="Workspace - Airpri"></iframe>`).then(() => {
            toast.success('Embed code copied')
        });
    }

    useEffect(() => {
        setPublicAccess(workspace?.access == 'public')
    }, [workspace])

    useEffect(() => {
        if (showModal) {
            (
                async () => {
                    try {
                        const _members = await getOrgMembers()
                        setOrgMembers(_members)
                    } catch (error) {
                        toast.error(error.message)
                    }
                }
            )()
        }

    }, [showModal])


    return (
        <Modal dismissible show={showModal} onClose={() => setShowModal(false)} size='xl'>
            <Modal.Header>Share & Embed the Workspace</Modal.Header>
            <Modal.Body>

                <div className='flex flex-row gap-2 border-b-[1px] border-gray-200 border-solid mb-6'>
                    <button className={`${activeForm == 'share' ? 'bg-gray-200' : 'bg-unset'} p-2.5`} onClick={() => {
                        setActiveForm('share')
                    }} disabled={submitting}>
                        Share & Embed
                    </button>
                    <button className={`${activeForm == 'invite' ? 'bg-gray-200' : 'bg-unset'} p-2.5`} onClick={() => {
                        setActiveForm('invite')
                    }} disabled={submitting}>
                        Invite new member
                    </button>
                </div>

                {
                    activeForm == 'share' ?

                        <div>

                            <div className='flex gap-2 items-center'>
                                <div className='flex-1 '>
                                    <p className='font-bold text-lg text-gray-900'>
                                        Publish and share the link with everyone
                                    </p>
                                    <p className='text-gray-500 '>
                                        This switch means that this is a public workspace
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


                            <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-full' type='submit' onClick={handleShare}>
                                {
                                    submitting ?
                                        <>
                                            <Spinner aria-label="Sharing Workspace" />
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

                        </div>

                        :

                        <div>

                            <h2>
                                Invitee member
                            </h2>

                            <div className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal'>
                                <Dropdown
                                    inline
                                    label={invitee ? invitee : 'Choose from your Organization'}
                                    className='bg-transparent z-20 bg-white'
                                >
                                    {
                                        orgMembers.map(({ email, _id }) => (
                                            <Dropdown.Item onClick={() => {
                                                if (email == invitee) {
                                                    setInvitee('')
                                                } else {
                                                    setInvitee(email)
                                                }
                                            }} >
                                                {email}
                                                {
                                                    email != invitee ? '' : <BsCheckLg />
                                                }
                                            </Dropdown.Item>
                                        ))
                                    }
                                </Dropdown>
                            </div>

                            <p className='mt-4 mb-2'>
                                Want to add non-{workspace?.name}/airpri user?. Enter the email below
                            </p>

                            <input type='email' ref={inviteeRef} className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal w-full' />


                            <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-full' type='submit' onClick={handleInvite}>
                                {
                                    submitting ?
                                        <>
                                            <Spinner aria-label="Inviting new member" />
                                            <span className="pl-3">
                                                Loading...
                                            </span>
                                        </>
                                        :
                                        <>
                                            <AiFillSave className='mr-2 text-lg ' />
                                            <span>
                                                Invite
                                            </span>
                                        </>
                                }
                            </Button>

                        </div>

                }



            </Modal.Body>
        </Modal>
    )
}

export default ShareWorkspaceModal