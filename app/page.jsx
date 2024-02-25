"use client"

import {
    Accordion, AccordionDetails, AccordionSummary,
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Grid,
    Typography
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import PractiseAPI from "../lib/practise";
import YoutubeEmbed from "./_components/embed_youtube";
import Box from "@mui/material/Box";
import {WEBAPP_ACTIONS} from "../lib/constants";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import get_practise_price from "../lib/prices";
import UniAlert from "./_components/alert/alert";

function SellIcon() {
    return null;
}

export default function Home() {
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
    const [practisePaidList, setPractisePaidList] = useState()

    const onClosedInvoice = (result) => {
        const {url, status} = result
        switch (status) {
            case "paid":
                showPractise(targetLink)
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
            tg.onEvent('invoiceClosed', onClosedInvoice)
            tg.openInvoice(link)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        const tg = window.Telegram?.WebApp
        console.log("Telegram:", window.Telegram)
        if (tg) {
            tg.ready()
            tg.expand()
            tg.onEvent('mainButtonClicked', onSendData)
        }
        console.log("TG=", tg)
        setTg(tg)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [])

    const getPractiseList = async () => {
        await PractiseAPI.get_practises().then(
            async (result) => {
                setPractiseList(result)
                const practise_paid = {}
                result.data.map(async (practise) => {
                    await if_practise_been_paid(practise.id).then(result => {
                        practise_paid[practise.id] = !!result
                    })
                })
                console.log("PractisePaid:", practise_paid)
                setPractisePaidList(practise_paid)
            }
        ).catch(error => console.log(error))
    }

    useEffect(() => {
        getPractiseList()
    }, [])

    const orderAction = (order_id, url) => {
        console.log("Order ID:", order_id)
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

    const if_practise_been_paid = async (practise_id) => {
        const tg_id = tg?.initDataUnsafe?.user?.id ? tg?.initDataUnsafe?.user?.id : -1
        await PractiseAPI.if_practise_been_paid({
            practise_id,
            tg_id
        }).then(result => {
            const invoice = result.data
            if (invoice) {
                if (!invoice.media_id) {
                    return true
                }
            }
            return false
        })
    }

    const showPractise = (url) => {
        tg?.openTelegramLink(url)
    }

    return (
        <Container>
            {isShowAlert &&
                <UniAlert severity={severity}>
                    {msg}
                </UniAlert>
            }
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="h3" color="info.main">
                    Курсы по йоге
                </Typography>
            </Box>
            <Grid container spacing={2} display="flex" justifyContent="center">
                {practiseList && Array.isArray(practiseList.data) && practiseList.data.map((practise) => (
                    <Grid item xs={12} md={6} display="flex" justifyContent="center" key={practise.id}>
                        <Card sx={{maxWidth: 420}}>
                            {practise.id}
                            <YoutubeEmbed embedId={practise.file_resource_link}/>
                            <CardContent>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ArrowDownwardIcon/>}
                                        aria-controls="panel1-content"
                                        id={"panel1-" + practise.id.toString()}
                                    >
                                        <Typography gutterBottom variant="h5" component="div">
                                            {practise.title}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" color="text.secondary">
                                            {practise.description}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                            <CardActions>
                                <Grid container spacing={2} display="flex" justifyContent="space-between">
                                    <Grid item xs={12} display="flex" justifyContent="space-between">
                                        {practisePaidList && practisePaidList[practise.id] ?
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
                                                <Chip icon={<SellIcon/>} label={discount.toString() + "%"}
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
        </Container>
    );
}
