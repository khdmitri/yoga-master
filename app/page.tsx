"use client"

import useTelegram from "./(hooks)/useTelegram";
import {Box, Button, Container, Typography} from "@mui/material";
import {useState} from "react";
import Script from "next/script";

function getTelegram(){
    let w: any = null
    if (typeof window !== "undefined") {
        // Client-side-only code
        w = window
        console.log("window=", w)
    }
    const tg = w?.Telegram?.WebApp
    console.log("TG=", tg)

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
    let {user, onClose, onToggleButton} = getTelegram()

    const refreshTelegram = () => {
        const tg = getTelegram()
        user = tg.tg
        onClose = tg.onClose
        onToggleButton = tg.onToggleButton
    }

    return (
        <Container>
            <Script src="https://telegram.org/js/telegram-web-app.js" />
            <Box display="flex" flexDirection="column">
                <Typography variant="h6">
                    <p>Username: {user?.username}</p>
                    <p>First Name: {user?.first_name}</p>
                    <p>Last Name: {user?.last_name}</p>
                    <p>Is Premium: {user?.is_premium}</p>
                </Typography>
                <Button onClick={refreshTelegram}>Refresh</Button>
            </Box>
            <Button onClick={onToggleButton}>Toggle</Button>
            <Button onClick={onClose}>Close Application</Button>
        </Container>
    );
}
