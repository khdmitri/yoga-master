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

const SectionPractise = () => {
    const discount = process.env.NEXT_PUBLIC_PRICE_DISCOUNT
    const [practiseList, setPractiseList] = useState(null)
    const [sendData, setSendData] = useState({action: -1, user_id: -1, order_id: -1})
    const [orderId, setOrderId] = useState(-1)
    const [targetLink, setTargetLink] = useState(null)
    const [tg, setTg] = useState(null)
    const [msg, setMsg] = useState(null)
    const [severity, setSeverity] = useState("info")
    const [isShowAlert, setIsShowAlert] = useState(false)
    const [serverLink, setServerLink] = useState("")
    const [windowSize, setWindowSize] = useState([640, 480]);
    const [isLoading, setIsLoading] = useState(false)
    const [cardWidth, setCardWidth] = useState(420);
    const router = useRouter();

  const cardRef = useCallback(node => {
    if (node !== null) {
      setCardWidth(node.getBoundingClientRect().width);
    }
  }, []);

    const onClosedInvoice = (result) => {
        const {url, status} = result
        setMsg(`Ваш платеж завершился со статусом: ${status}`)
        setSeverity("info")
        setIsShowAlert(true)
        switch (status) {
            case "paid":
                showPractise(targetLink)
                router.refresh()
                break
            case "cancelled":
                setMsg("Платеж был отменен пользователем")
                setSeverity("warning")
                setIsShowAlert(true)
                break
            case "failed":
                setMsg("Платеж не завершился успешно")
                setSeverity("error")
                setIsShowAlert(true)
                break
            case "pending":
                setMsg("Платеж пока не обработан сервером, переходите в наш бот, чтобы увидеть статус")
                setSeverity("warning")
                setIsShowAlert(true)
                break
        }
    }

    const onSendData = async () => {
        setIsShowAlert(false)
        await PractiseAPI.send_data_to_bot(sendData).then(result => {
            const link = result.data
            setServerLink(link)
            tg.MainButton.hide()
            tg.openInvoice(link)
        }).catch(error => {
            console.log(error)
        })
    }

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
        if (tg) {
            getPractiseList()
        }
    }, [tg])

    useEffect(() => {
        const tg = window.Telegram?.WebApp
        console.log("Telegram:", window.Telegram)
        if (tg) {
            tg.ready()
            tg.expand()
            tg.onEvent('mainButtonClicked', onSendData)
            tg.onEvent('invoiceClosed', onClosedInvoice)
        }
        setTg(tg)

        setWindowSize([
            window.innerWidth,
            window.innerHeight,
        ])

        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            tg?.offEvent('mainButtonClicked', onSendData)
            tg?.offEvent('invoiceClosed', onClosedInvoice)
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])

    const orderAction = (order_id, url) => {
        const data_to_send = {
            action: WEBAPP_ACTIONS.buy_practise,
            order_id: order_id,
            user_id: tg?.initDataUnsafe?.user?.id
        }
        setSendData(data_to_send)
        setOrderId(order_id)
        setTargetLink(url)
    }

    useEffect(() => {
        if (sendData.order_id > 0) {
            const mainButton = tg?.MainButton
            if (mainButton) {
                mainButton.onClick(onSendData)
                mainButton.text = 'ПЕРЕЙТИ К ОПЛАТЕ'
                mainButton.show()
            }
        }
    }, [sendData])

    const showPractise = (url) => {
        tg.openTelegramLink(url)
        tg.close()
    }

    return (
        <section className="section_practise">
            <Container sx={{backgroundColor: tg?.themeParams?.section_bg_color,}}>
                {isShowAlert &&
                    <UniAlert severity={severity}>
                        {msg}
                    </UniAlert>
                }
                <Box id="courses" display="flex" justifyContent="center">
                    <Image src="/labels/practises.png" alt="Курсы по йоге" width={300} height={100}/>
                </Box>
                {isLoading ?
                    <Box display="flex" justifyContent="center">
                        <Image src="/service/is_loading.gif" alt="is loading..." height={256} width={256} priority={true}/>
                    </Box>
                    :
                    <Grid container spacing={1} display="flex" justifyContent="center">
                        {practiseList && practiseList.map((practise) => (
                            <Grid item xs={12} md={6} display="flex" justifyContent="center" key={practise.id}>
                                <Card sx={{maxWidth: windowSize[0]}} ref={cardRef}>
                                    <YoutubeEmbed embedId={practise.file_resource_link}
                                                  width={cardWidth}/>
                                    <CardContent>
                                        <Accordion sx={{
                                            color: tg?.themeParams?.text_color,
                                            backgroundColor: tg?.themeParams?.secondary_bg_color
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
                                                                        practise.channel_resource_link)}>
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