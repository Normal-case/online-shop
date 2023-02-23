import React, { useState } from "react"
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

export default function ImageSlider({ slides }) {

    const [currentIndex, setCurrentIndex] = useState(0)

    const sliderStyles = {
        height: '100%',
        position: 'relative'
    }

    const slideStyles = {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${slides[currentIndex]})`
    }

    const leftArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '10px',
        fontSize: '24px',
        color: '#505050',
        zIndex: '1',
        cursor: 'pointer'
    }

    const rightArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '10px',
        fontSize: '24px',
        color: '#505050',
        zIndex: '1',
        cursor: 'pointer'
    }

    const dotsContainerStyles = {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        bottom: '0%',
        transform: 'translate(100%, -50%)'
    }

    const dotStyles = {
        margin: '0 3px',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#aaaaaa'
    }

    const dotStyles_active = {
        margin: '0 3px',
        cursor: 'pointer',
        fontSize: '20px',
        color: '#fff'
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? slides.length -1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length -1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }


    return (
        <div style={sliderStyles}>
            <div style={leftArrowStyles} onClick={goToPrevious}><LeftOutlined /></div>
            <div style={rightArrowStyles} onClick={goToNext}><RightOutlined /></div>
            <div style={slideStyles}></div>
            <div style={dotsContainerStyles}>
                {slides.map((slide, slideIndex) => (
                    <div 
                        key={slideIndex} 
                        style={slideIndex === currentIndex ? dotStyles_active : dotStyles} 
                        onClick={() => goToSlide(slideIndex)}
                    >●</div>
                ))}
            </div>
        </div>
    )
}