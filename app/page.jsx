"use client"

import {Button, Card, CardActions, CardContent, Chip, Container, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import PractiseAPI from "../lib/practise";
import YoutubeEmbed from "./_components/embed_youtube";

function getTelegram(setW) {
    let tg = null
    if (typeof window !== "undefined") {
        // Client-side-only code
        setW(window)
        console.log("window=", window)
        tg = window.Telegram?.WebApp
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
    }
}

function SellIcon() {
    return null;
}

export default function Home() {
    const [tgObj, setTgObj] = useState({})
    const [w, setW] = useState(null)
    const [practiseList, setPractiseList] = useState(null)

    const getPractiseList = async () => {
        await PractiseAPI.get_practises().then(
            result => setPractiseList(result)
        ).catch(error => console.log(error))
    }

    useEffect(() => {
        getPractiseList()
    }, [])

    useEffect(() => {
        setTgObj(getTelegram(setW))
    }, [w])

    return (
        <Container>
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
                                        <Button variant="contained" size="medium">
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
