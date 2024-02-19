"use client"

import {Button, Card, CardActions, CardContent, Chip, Container, Grid, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import PractiseAPI from "../lib/practise";
import YoutubeEmbed from "./_components/embed_youtube";
import Box from "@mui/material/Box";
import {WEBAPP_ACTIONS} from "../lib/constants";

async function getTelegram() {
    let tg = null
    if (typeof window !== "undefined") {
        // Client-side-only code
        setW(window)
        console.log("window=", window)
        tg = window.Telegram?.WebApp
        if (tg) {
            tg.ready()
            tg.onEvent('mainButtonClicked', onSendData)
            tg.MainButton.show()
        }
        console.log("TG=", tg)
    }

    const onClose = () => {
        tg?.close()
    }

    const onToggleButton = () => {
        if (tg?.MainButton?.isVisible) {
            tg?.MainButton?.hide()
        } else {
            tg?.MainButton?.show()
        }
    }


    return {
        tg,
        onClose,
        onToggleButton,
        user: tg?.initDataUnsafe?.user,
        query_id: tg?.initDataUnsafe?.query_id
    }
}

function SellIcon() {
    return null;
}

export default function Home() {
    const [practiseList, setPractiseList] = useState(null)
    const [orderId, setOrderId] = useState(-1)
    const [tg, setTg] = useState(null)

    // const onSendData = useCallback(async () => {
    //     const {user, query_id, onClose} = getTelegram()
    //     if (orderId > 0 && query_id) {
    //         await PractiseAPI.send_data_to_bot({
    //             action: WEBAPP_ACTIONS.buy_practise,
    //             order_id: orderId,
    //             user_id: user?.id,
    //             query_id: query_id
    //         }).then(result => {
    //             console.log("Result:", result)
    //             onClose()
    //         })
    //     }
    // }, [orderId])
    useEffect(() => {
        const tg = window.Telegram?.WebApp
        console.log("Telegram:", window.Telegram)
        if (tg) {
            tg.ready()
            tg.expand()
        }
        console.log("TG=", tg)
        setTg(tg)
    }, [window])

    const getPractiseList = async () => {
        await PractiseAPI.get_practises().then(
            result => setPractiseList(result)
        ).catch(error => console.log(error))
    }

    useEffect(() => {
        getPractiseList()
    }, [])

    const orderAction = (order_id) => {
        console.log("Order ID:", order_id)
        setOrderId(order_id)
        const mainButton = tgObj?.tg?.MainButton
        if (mainButton) {
            mainButton.text = 'ПЕРЕЙТИ К ОПЛАТЕ'
            mainButton.show()
        }
    }

    return (
        <Container>
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="h3" color="info.main">
                    Курсы по йоге
                </Typography>
            </Box>
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="body2" color="primary.main">
                    {JSON.stringify(tg)}
                </Typography>
            </Box>
            <Grid container spacing={2} display="flex" justifyContent="center">
                {practiseList && Array.isArray(practiseList.data) && practiseList.data.map((practise) => (
                    <Grid item xs={12} md={6} display="flex" justifyContent="center" key={practise.id}>
                        <Card sx={{maxWidth: 420}}>
                            <YoutubeEmbed embedId={practise.file_resource_link}/>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {practise.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {practise.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container spacing={2} display="flex" justifyContent="space-between">
                                    <Grid item xs={12} display="flex" justifyContent="space-between">
                                        <Button variant="contained" size="medium"
                                                onClick={() => orderAction(practise.id)}>
                                            КУПИТЬ ЗА 1999 руб.
                                        </Button>
                                        <Chip icon={<SellIcon/>} label="20%" color="error"/>
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
