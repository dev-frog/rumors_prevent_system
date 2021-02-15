import React from 'react'
import '../App.css'
import './HeroSection.css'
import From from './Form/Form'


function HeroSection() {
    return (
        <>
            <div className='hero-container'>
                <video src='/videos/vid-2.mp4' autoPlay loop muted />
                <h1>Check your facts before you trust them</h1>
                <p className="heroSection_input_text">Input the news article url/link here</p>
                <From />
            </div>
 
            
        </>
    )
}

export default HeroSection
