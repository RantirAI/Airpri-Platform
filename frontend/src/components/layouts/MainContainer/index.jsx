import React from 'react'
import Footer from './Footer'
import Header from './Header'
import LeftPane from './LeftPane'

const MainContainer = ({ children }) => {
    return (
        <div className=' flex flex-col bg-gray-300 dark:bg-[#101016] '>
            <Header />
                <LeftPane />
                <div style={{left: 'calc(100% / 6)' }} className='min-h-screen w-5/6 relative pt-16 flex flex-col px-[20px] py-[10px]'>
                    <div >
                    {children}
                    </div>
                    <Footer/>
                </div>
        </div>
    )
}

export default MainContainer