"use client"

import {Box, Button, Container, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Script from "next/script";

function getTelegram(){
    let tg = null
    if (typeof window !== "undefined") {
        // Client-side-only code
        const w = window
        console.log("window=", w)
        tg = w.Telegram?.WebApp
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

    useEffect(() => {
        setTgObj(getTelegram())
    }, [])

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
