import React, { useState } from 'react'
import ArchiveWorkspaceModal from '../../modals/ArchiveWorkspaceModal'
import DeleteWorkspaceModal from '../../modals/DeleteWorkspaceModal'
import DuplicateWorkspaceModal from '../../modals/DuplicateWorkspaceModal'
import NewWorkspaceModal from '../../modals/NewWorkspaceModal'
import WorkspaceSettingsModal from '../../modals/WorkspaceSettingsModal'
import Footer from './Footer'
import Header from './Header'
import LeftPane from './LeftPane'

const MainContainer = ({ children }) => {
    const [showLeftPane, setShowLeftPane] = useState(false)
    return (
        <div className=' flex flex-col bg-gray-300 dark:bg-[#101016] '>
            <Header showLeftPane={showLeftPane} setShowLeftPane={setShowLeftPane} />
            <LeftPane showLeftPane={showLeftPane} setShowLeftPane={setShowLeftPane} />
            <div className='min-h-screen w-full lg:w-4/5 left-0 lg:left-[20%] relative pt-16 flex flex-col px-[10px] lg:px-[20px] py-[10px]'>
                <div >
                    {children}
                </div>
                <Footer />

                <NewWorkspaceModal />
                <DeleteWorkspaceModal />
                <ArchiveWorkspaceModal />
                <DuplicateWorkspaceModal />
                <WorkspaceSettingsModal />
            </div>
        </div>
    )
}

export default MainContainer