import React from 'react'
import Footer from './Footer'
import Header from './Header'
import LeftPane from './LeftPane'

const index = ({ children }) => {
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

export default index