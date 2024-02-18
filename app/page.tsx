"use client"

import styles from "./page.module.css";
import useTelegram from "./(hooks)/useTelegram";
import {Box, Button, Container, Stack, Typography, Item} from "@mui/material";
import {useEffect, useState} from "react";

export default function Home() {
    const [telegram, setTelegram] = useState(null)
    useEffect(() => {
        setTelegram(useTelegram())
    }, [])

    return (
        <Container>
            <Box display="flex" flexDirection="column">
                <Typography variant="h6">
                    <p>Username: {telegram?.user?.username}</p>
                    <p>First Name: {telegram?.user?.first_name}</p>
                    <p>Last Name: {telegram?.user?.last_name}</p>
                    <p>Is Premium: {telegram?.user?.is_premium}</p>
                </Typography>
            </Box>
            <Button onClick={telegram?.onToggleButton}>Toggle</Button>
            <Button onClick={telegram?.onClose}>Close Application</Button>
        </Container>
    );
}
