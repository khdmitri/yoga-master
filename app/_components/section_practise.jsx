"use client"

import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Button,
    Card, CardActions,
    CardContent, Chip,
    Container,
    Grid,
    Typography
} from "@mui/material";
import UniAlert from "./alert/alert";
import Box from "@mui/material/Box";
import Image from "next/image";
import SellIcon from '@mui/icons-material/Sell';
import YoutubeEmbed from "./embed_youtube";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import get_practise_price from "../../lib/prices";
import {useCallback, useEffect, useRef, useState} from "react";
import PractiseAPI from "../../lib/practise";
import {WEBAPP_ACTIONS} from "../../lib/constants";
import {useRouter} from "next/navigation";
import SectionCarousel from "./section_carousel";

const SectionPractise = (props) => {
    const {setMsg, setSeverity, setIsShowAlert, tg, orderAction, needRefresh, setNeedRefresh} = props
    const discount = process.env.NEXT_PUBLIC_PRICE_DISCOUNT
    const [practiseList, setPractiseList] = useState(null)
    const [windowSize, setWindowSize] = useState([640, 480]);
    const [isLoading, setIsLoading] = useState(false)
    const [cardWidth, setCardWidth] = useState(420);

    const cardRef = useCallback(node => {
        if (node !== null) {
            setCardWidth(node.getBoundingClientRect().width);
        }
    }, []);

    const if_practise_been_paid = async (practise_id) => {
        const tg_id = tg?.initDataUnsafe?.user?.id
        if (tg_id) {
            const result = await PractiseAPI.if_practise_been_paid({
                practise_id,
                tg_id
            })
            return result.data
        } else {
            return false
        }
    }

    const getPractiseList = async () => {
        setIsLoading(true)
        await PractiseAPI.get_practises().then(async (result) => {
                const practises = await Promise.all(result.data.map(async (practise) => {
                    const r = await if_practise_been_paid(practise.id)
                    practise.is_paid = !!r
                    return practise
                }))
                setPractiseList(practises)
                setIsLoading(false)
            }
        ).catch(error => {
            console.log(error)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        if (tg && needRefresh) {
            getPractiseList()
            setNeedRefresh(false)
        }
    }, [tg, needRefresh])

    useEffect(() => {

        setWindowSize([
            window.innerWidth,
            window.innerHeight,
        ])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    const showPractise = (url) => {
        tg.openTelegramLink(url)
        tg.close()
    }


    return (
        <section className="section_practise" id="PRACTISE_ID">
            <Container sx={{backgroundColor: tg?.themeParams?.section_bg_color,}}>
                <Box id="courses" display="flex" justifyContent="center" sx={{paddingTop: 3, paddingBottom: 3}}>
                    {/*<Image src="/labels/practises.png" alt="Курсы по йоге" width={300} height={100}/>*/}
                    <Typography variant="h6" color="#00008B"><strong>🧘 АВТОРСКИЕ КУРСЫ ПО ЙОГЕ 🧘</strong></Typography>
                </Box>
                {isLoading ?
                    <Box display="flex" justifyContent="center">
                        <Image src="/service/is_loading.gif" alt="is loading..." height={256} width={256}
                               priority={true}/>
                    </Box>
                    :
                    <Grid container spacing={1} display="flex" justifyContent="center">
                        {practiseList && practiseList.map((practise) => (
                            <Grid item xs={12} md={6} display="flex" justifyContent="center" key={practise.id}>
                                <Card sx={{
                                    maxWidth: windowSize[0],
                                    backgroundColor: "#FFDAB9",
                                    boxShadow: "rgba(0, 0, 0, 0.45) 0 5px 8px;"
                                }}
                                      ref={cardRef}>
                                    <YoutubeEmbed embedId={practise.file_resource_link}
                                                  width={cardWidth}/>
                                    <CardContent>
                                        <Accordion sx={{
                                            color: tg?.themeParams?.text_color,
                                            backgroundColor: "#FFE4B5"
                                        }}>
                                            <AccordionSummary
                                                expandIcon={<ArrowDownwardIcon/>}
                                                aria-controls="panel1-content"
                                                id={"panel1-" + practise.id.toString()}
                                            >
                                                <Typography gutterBottom variant="h6" component="div"
                                                            sx={{color: tg?.themeParams?.accent_text_color}}>
                                                    {practise.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2"
                                                            color={tg ? tg?.themeParams?.text_color : "text.secondary"}>
                                                    {practise.description}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </CardContent>
                                    <CardActions>
                                        <Grid container spacing={2} display="flex" justifyContent="space-between">
                                            <Grid item xs={12} display="flex" justifyContent="space-between">
                                                {practise.is_paid ?
                                                    <Button variant="contained" size="medium"
                                                            onClick={() => showPractise(practise.channel_resource_link)}>
                                                        Практика куплена. Нажмите здесь, чтобы смотреть
                                                    </Button>
                                                    : get_practise_price(practise) > 0 ?
                                                        <>
                                                            <Button variant="contained" size="medium"
                                                                    onClick={() => orderAction(practise.id,
                                                                        practise.channel_resource_link,
                                                                        WEBAPP_ACTIONS.buy_practise)}>
                                                                {get_practise_price(practise)} руб.
                                                            </Button>
                                                            <Chip icon={<SellIcon/>}
                                                                  label={discount.toString() + "%"}
                                                                  color="error"/>
                                                        </>
                                                        :
                                                        <Button variant="contained" size="medium"
                                                                onClick={() => showPractise(practise.channel_resource_link)}>
                                                            Нажмите здесь, чтобы смотреть
                                                        </Button>
                                                }
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                }
            </Container>
        </section>
    );
};

export default SectionPractise;