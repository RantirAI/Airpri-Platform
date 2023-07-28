import { Button, Dropdown, Label, Modal, Spinner, Textarea, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { getOrgMembers } from '../../services/user'
import { createWorkspace } from '../../services/workspace'
import { BsCheckLg } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectWorkspace } from '../../redux/features/workspaceSlice'
import { toggleDuplicateWorkspaceModal } from '../../redux/features/modalsSlice'

const DuplicateWorkspaceModal = () => {

    const { showDuplicateWorkspaceModal } = useSelector(state => state.modals)
    const { workspace } = useSelector(state => state.workspace)

    const nameRef = useRef(null)
    const descriptionRef = useRef(null)
    const [members, setMembers] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)

    const [orgMembers, setOrgMembers] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const workspace = await createWorkspace({ name: nameRef.current.value, description: descriptionRef.current.value, members: members.map(({ _id }) => (_id))  })
            toast.success('Workspace successfully created!')
            nameRef.current.value = ''
            descriptionRef.current.value = ''
            setMembers([])
            dispatch(toggleDuplicateWorkspaceModal(false))
            dispatch(selectWorkspace(workspace))
            navigate('/workspace')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }


    useEffect(() => {
        if (showDuplicateWorkspaceModal) {
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

    }, [showDuplicateWorkspaceModal])

    useEffect(() => {
        if (showDuplicateWorkspaceModal) {
            nameRef.current.value = `${workspace.name} copy`
            descriptionRef.current.value = workspace.description
            setMembers(workspace.members.map(({ _id, email }) => ({ email, _id })))
        }
    }, [showDuplicateWorkspaceModal])


    return (
        <Modal dismissible show={showDuplicateWorkspaceModal} onClose={() => dispatch(toggleDuplicateWorkspaceModal(false))} size='md'>
            <Modal.Header>Duplicate Workspace</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        id='workspace-name'
                        placeholder='Set a Workspace Name'
                        required
                        type='text'
                        ref={nameRef}
                    />

                    <div className="mb-2 block">
                        <Label
                            htmlFor="workspace-members"
                            value="Invite Members"
                            className='text-[14px] lg:text-base font-semibold text-gray-900 my-[20px] block'
                        />
                    </div>

                    <div className='border border-solid border-gray-300 p-[12px] rounded-[8px] focus:border-2 focus:border-[#1ABFAB] bg-gray-50 dark:bg-gray-700 text-gray-500 leading-tight text-sm font-normal'>
                        <Dropdown
                            inline
                            label={members.length > 0 ? members.map((member) => member.email).join(' , ') : 'Choose from your Organization'}
                            className='bg-transparent z-20 bg-white'
                        >
                            {
                                orgMembers.map(({ email, _id }) => (
                                    <Dropdown.Item onClick={() => {
                                        const memberSelected = members.findIndex((member) => member._id == _id)
                                        if (memberSelected == -1) {
                                            setMembers([...members, { email, _id }])
                                        } else {
                                            setMembers(members.filter((member) => (
                                                member._id != _id
                                            )))
                                        }
                                    }} >
                                        {email}
                                        {
                                            members.findIndex((member) => member._id == _id) == -1 ? '' : <BsCheckLg />
                                        }
                                    </Dropdown.Item>
                                ))
                            }
                        </Dropdown>
                    </div>


                    <div className="mb-2 block">
                        <Label
                            htmlFor="workspace-description"
                            value="Give a Workspace Description"
                            className='text-[14px] lg:text-base font-semibold text-gray-900 my-[20px] block'
                        />
                    </div>
                    <Textarea
                        id="workspace-description"
                        placeholder="I made some wireframes that we would like you to follow since we are building it in Rantir’s next generation spreadsheet & AI module that is open to the public... "
                        required
                        rows={4}
                        ref={descriptionRef}
                    />
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
                                        Create Workspace
                                    </span>
                                </>
                        }
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default DuplicateWorkspaceModal