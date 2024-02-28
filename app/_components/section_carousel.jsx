"use client"
import React, {useEffect} from 'react';

SwiperCore.use([Navigation, Pagination, A11y]);

// Import Swiper React components
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Image from "next/image";
import SwiperCore from "swiper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
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
            Math.round(window.innerWidth*0.9),
            Math.round(window.innerWidth*0.9*16/9)
        ])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    })

    return (
        <Container>
            <Box display="flex" justifyContent="center">
                <Swiper
                    // install Swiper modules
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{clickable: true}}
                    // scrollbar={{draggable: true}}
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                    wrapperTag="ul"
                >
                    <SwiperSlide tag="li">
                        <div className="shadowed-box">
                            <Box display="flex" justifyContent="center">
                                <Image src="/carousel/1.jpg" alt="photo" width={photoSize[0]} height={photoSize[1]}/>
                            </Box>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide tag="li">
                        <div className="shadowed-box">
                            <Box display="flex" justifyContent="center">
                                <Image src="/carousel/2.jpg" alt="photo" width={photoSize[0]} height={photoSize[1]}/>
                            </Box>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </Box>
        </Container>
    );
};

export default SectionCarousel;