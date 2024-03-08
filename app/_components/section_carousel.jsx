"use client"
import React, {useEffect, useState} from 'react';
import ShowCarousel from "./server/show_carousel";

const SectionCarousel = () => {
    const [windowSize, setWindowSize] = useState([640, 480]);
    const [photoSize, setPhotoSize] = useState([229, 408]);

    const handleWindowResize = () => {
        setWindowSize([window.innerWidth, window.innerHeight]);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize)
        setWindowSize([window.innerWidth, window.innerHeight]);

        setPhotoSize([
            Math.round(windowSize[0] * 0.6),
            Math.round(windowSize[0] * 0.6 * 16 / 9)
        ])

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    return (
        <ShowCarousel photoSize={photoSize} />
    );
};

export default SectionCarousel;