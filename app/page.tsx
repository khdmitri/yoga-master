"use client"

import useTelegram from "./(hooks)/useTelegram";
import {Box, Button, Container, Typography} from "@mui/material";
import {useState} from "react";

export default function Home() {
    const {user, onClose, onToggleButton} = useTelegram()

    return (
        <Container>
            <Box display="flex" flexDirection="column">
                <Typography variant="h6">
                    <p>Username: {user?.username}</p>
                    <p>First Name: {user?.first_name}</p>
                    <p>Last Name: {user?.last_name}</p>
                    <p>Is Premium: {user?.is_premium}</p>
                </Typography>
            </Box>
            <Button onClick={onToggleButton}>Toggle</Button>
            <Button onClick={onClose}>Close Application</Button>
        </Container>
    );
}
