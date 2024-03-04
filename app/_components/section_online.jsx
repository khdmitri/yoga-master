"use client"
import React, {useEffect, useState} from 'react';
import PractiseAPI from "../../lib/practise";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Container from "@mui/material/Container";
import OnlineList from "./lists/online_list";
import Image from "next/image";

const SectionOnline = (props) => {
    const {setMsg, setSeverity, setIsShowAlert, tg, orderAction, needRefresh, setNeedRefresh} = props
    const [lessons, setLessons] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [invoice, setInvoice] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        const get_lessons = async () => {
            await PractiseAPI.get_lessons().then(result => {
                setLessons(result.data)
                setIsLoading(false)
            }).catch(error => {
                console.log(error)
                setIsLoading(false)
            })
        }
        get_lessons()
    }, [])

    useEffect(() => {
        if (tg && needRefresh) {
            if (tg.initDataUnsafe?.user?.id) {
                const get_invoice = async () => {
                    await PractiseAPI.get_paid_invoice_online({
                        tg_id: tg?.initDataUnsafe?.user?.id
                    }).then(result => {
                        setInvoice(result.data)
                    })
                }
                get_invoice()
            }
            setNeedRefresh(false)
        }
    }, [tg, needRefresh])

    return (
        <section className="section_online" id="ONLINE_ID">
            <Container>
                <Box>
                    Invoice: {invoice?.id}
                </Box>
                <Box className="section-label-box" id="courses" display="flex" justifyContent="center" sx={{paddingTop: 3, paddingBottom: 3}}>
                    <Typography variant="h6" color="#00008B"><strong>ЗАПИСАТЬСЯ НА ONLINE-УРОК 👇</strong></Typography>
                </Box>
                {isLoading ?
                    <Box display="flex" justifyContent="center">
                        <Image src="/service/is_loading.gif" alt="is loading..." height={256} width={256}
                               priority={true}/>
                    </Box>
                    :
                    <OnlineList lessons={lessons} invoice={invoice} orderAction={orderAction}
                                user_id={tg?.initDataUnsafe?.user?.id} needRefresh={needRefresh}
                                setNeedRefresh={setNeedRefresh}
                    />
                }
            </Container>
        </section>
    )
}

export default SectionOnline;