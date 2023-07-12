import React from 'react'
import Footer from './Footer'
import Header from './Header'
import LeftPane from './LeftPane'

const MainContainer = ({ children }) => {
    return (
        <div>
            <Header />
            <div>
                <LeftPane />
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default MainContainer