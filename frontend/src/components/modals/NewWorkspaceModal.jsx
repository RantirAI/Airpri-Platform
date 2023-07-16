import { Button, Label, Modal, Textarea, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { TbClipboardList } from 'react-icons/tb'

const NewWorkspaceModal = ({ openModal, setOpenModal }) => {
    const [workspaceName, setWorkspaceName] = useState('')

    const [submitting, setSubmitting] = useState(false)
    // const []

    const handleSubmit = async () => {

    }

    return (
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} size='md'>
            <Modal.Header>Add a New Workspace</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        id='workspace-name'
                        placeholder='Set a Workspace Name'
                        required
                        type='text'
                        value={workspaceName}
                    />

                    <div className="mb-2 block">
                        <Label
                            htmlFor="workspace-description"
                            value="Give a Workspace Description"
                            className='text-lg font-semibold text-gray-900 my-[20px] block'
                        />
                    </div>
                    <Textarea
                        id="workspace-description"
                        placeholder="I made some wireframes that we would like you to follow since we are building it in Rantir’s next generation spreadsheet & AI module that is open to the public... "
                        required
                        rows={4}
                    />
                    <Button className='bg-[#1ABFAB] text-white dark:text-gray-900 mt-[20px] flex justify-center w-full' type='submit' onClick={() => {
                        console.log('hii')
                    }}>
                        <TbClipboardList className='mr-2 text-xl ' />
                        <span>
                            Start a New Workspace
                        </span>
                    </Button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default NewWorkspaceModal