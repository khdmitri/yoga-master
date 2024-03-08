import React from 'react';

SwiperCore.use([Navigation, Pagination, A11y, EffectCards, Autoplay]);

import {Swiper, SwiperSlide} from "swiper/react";
import Box from "@mui/material/Box";
import Image from "next/image";
import {A11y, Autoplay, EffectCards, Navigation, Pagination} from "swiper/modules";
import SwiperCore from "swiper";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

const ShowCarousel = (props) => {
    const {photoSize} = props

    const pictures = () => {
        const arr = []
        for (let i = 1; i <= 7; i++) {
            arr.push(
                <SwiperSlide tag="li" key={"photo_" + i.toString()}>
                    <div className="shadowed-box">
                        <Box display="flex" justifyContent="center">
                            <Image src={"/carousel/" + i.toString() + ".jpg"} alt="photo" width={photoSize[0]}
                                   height={photoSize[1]}/>
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

export default ShowCarousel;