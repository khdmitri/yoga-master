"use client"
import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import Image from "next/image";

const AlertLoading = ({open}) => {
    return (
        <React.Fragment>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Обрабатываем запрос"}
                </DialogTitle>
                <DialogContent>
                    <Image src="/service/is_loading_2.gif" alt="is processing..." height={256} width={256}
                               priority={true}/>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default AlertLoading;