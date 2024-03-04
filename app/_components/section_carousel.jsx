"use client"
import React, {useEffect} from 'react';

SwiperCore.use([Navigation, Pagination, A11y, EffectCards, Autoplay]);

// Import Swiper React components
import {Navigation, Pagination, A11y, EffectCards, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

import Image from "next/image";
import SwiperCore from "swiper";
import Box from "@mui/material/Box";
import {useState} from "react";

const SectionCarousel = () => {
    const [windowSize, setWindowSize] = useState([640, 480]);
    const [photoSize, setPhotoSize] = useState([229, 408]);

    useEffect(() => {
        setWindowSize([
            window.innerWidth,
            window.innerHeight,
        ])

        setPhotoSize([
            Math.round(window.innerWidth * 0.6),
            Math.round(window.innerWidth * 0.6 * 16 / 9)
        ])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    const pictures = () => {
        const arr = []
        for (let i = 1; i <= 7; i++) {
            arr.push(
                <SwiperSlide tag="li" key={"photo_"+i.toString()}>
                    <div className="shadowed-box">
                        <Box display="flex" justifyContent="center">
                            <Image src={"/carousel/"+i.toString()+".jpg"} alt="photo" width={photoSize[0]} height={photoSize[1]}/>
                        </Box>
                    </div>
                </SwiperSlide>
            )
        }
        return arr
    }

    return (
        <Box display="flex" justifyContent="center">
            <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, A11y, EffectCards, Autoplay]}
                autoplay={true}
                effect="cards"
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{clickable: true}}
                // scrollbar={{draggable: true}}
                // onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log('slide change')}
                wrapperTag="ul"
            >
                {pictures()}
            </Swiper>
        </Box>
    );
};

export default SectionCarousel;