"use client"
import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";

const AlertShowUrl = ({initOpen, url, tg}) => {
    const [open, setOpen] = React.useState(initOpen);

    const handleClose = () => {
        tg?.openTelegramLink(url)
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Процесс оплаты успешно завершен!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Самое время перейти в Telegram. Спасибо, что поддерживаете меня!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        ПЕРЕЙТИ
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AlertShowUrl;