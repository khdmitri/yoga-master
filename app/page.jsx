"use client"

import {Alert, Button, Card, CardActions, CardContent, Chip, Container, Grid, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import PractiseAPI from "../lib/practise";
import YoutubeEmbed from "./_components/embed_youtube";
import Box from "@mui/material/Box";
import {WEBAPP_ACTIONS} from "../lib/constants";

function SellIcon() {
    return null;
}

export default function Home() {
    const [practiseList, setPractiseList] = useState(null)
    const [sendData, setSendData] = useState({})
    const [orderId, setOrderId] = useState(-1)
    const [tg, setTg] = useState(null)
    const [msg, setMsg] = useState(null)

    const onSendData = async () => {
        const data_to_send = {
            action: WEBAPP_ACTIONS.buy_practise,
            order_id: orderId,
            user_id: tg?.initDataUnsafe?.user?.id
        }
        setSendData(data_to_send)
        if (orderId > 0) {
            await PractiseAPI.send_data_to_bot(data_to_send).then(result => {
                console.log("Result:", result)
                tg.close()
            }).catch(error => {
                setMsg(JSON.stringify(error))
            })
        }
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
            result => setPractiseList(result)
        ).catch(error => console.log(error))
    }

    useEffect(() => {
        getPractiseList()
    }, [])

    const orderAction = (order_id) => {
        console.log("Order ID:", order_id)
        setOrderId(order_id)
        const mainButton = tg?.MainButton
        if (mainButton) {
            mainButton.onClick(onSendData)
            mainButton.text = 'ПЕРЕЙТИ К ОПЛАТЕ'
            mainButton.show()
        }
    }

    return (
        <Container>
            {msg &&
                <Alert color="error.main">
                    {msg}
                </Alert>
            }
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="h3" color="info.main">
                    Курсы по йоге
                </Typography>
            </Box>
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="body2" color="primary.main">
                    User ID: {tg?.initDataUnsafe?.user?.id}<br />
                    OrderID: {orderId}<br />
                </Typography>
            </Box>
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="body2" color="primary.main">
                    ===========================================
                </Typography>
            </Box>
            <Box id="courses" display="flex" justifyContent="center">
                <Typography variant="body2" color="primary.main">
                    {JSON.stringify(sendData)}
                </Typography>
            </Box>
            <Grid container spacing={2} display="flex" justifyContent="center">
                {practiseList && Array.isArray(practiseList.data) && practiseList.data.map((practise) => (
                    <Grid item xs={12} md={6} display="flex" justifyContent="center" key={practise.id}>
                        <Card sx={{maxWidth: 420}}>
                            {practise.id}
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
