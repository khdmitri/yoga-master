"use client"

import {Box, Button, Container, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Script from "next/script";
import {setDefaultHighWaterMark} from "stream";

function getTelegram(setW){
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

export default function Home() {
    const [tgObj, setTgObj] = useState({})
    const [w, setW] = useState(null)

    useEffect(() => {
        setTgObj(getTelegram(setW))
    }, [w])

    const refreshTelegram = () => {
        setTgObj(getTelegram())
    }

    return (
        <Container>
            <Box display="flex" flexDirection="column">
                <Typography variant="h6">
                    <p>Username: {tgObj.user?.username}</p>
                    <p>First Name: {tgObj.user?.first_name}</p>
                    <p>Last Name: {tgObj.user?.last_name}</p>
                    <p>Is Premium: {tgObj.user?.is_premium}</p>
                </Typography>
                <Button onClick={refreshTelegram}>Refresh</Button>
            </Box>
            <Button onClick={tgObj.onToggleButton}>Toggle</Button>
            <Button onClick={tgObj.onClose}>Close Application</Button>
        </Container>
    );
}
