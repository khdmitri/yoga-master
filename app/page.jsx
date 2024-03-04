"use client"
import dynamic from "next/dynamic";
import "./page.module.css";
import SectionIntro from "./_components/section_intro";
import SectionCarousel from "./_components/section_carousel";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import PractiseAPI from "../lib/practise";
import UniAlert from "./_components/alert/alert";
import SectionOnline from "./_components/section_online";
import {WEBAPP_ACTIONS} from "../lib/constants";
import {useRouter} from "next/navigation";
import SectionPractise from "./_components/section_practise";
import SectionFooter from "./_components/section_footer";
import AlertShowUrl from "./_components/alert/alert_show_url";

function SellIcon() {
    return null;
}

export default function Home() {
    const [sendData, setSendData] = useState({action: -1, user_id: -1, order_id: -1})
    const [msg, setMsg] = useState(null)
    const [severity, setSeverity] = useState("info")
    const [isShowAlert, setIsShowAlert] = useState(false)
    const [tg, setTg] = useState(null)
    const [targetLink, setTargetLink] = useState(null)
    const [needRefreshPractise, setNeedRefreshPractise] = useState(true)
    const [needRefreshOnline, setNeedRefreshOnline] = useState(true)
    const [obj, setObj] = useState({})
    const [isShowContent, setIsShowContent] = useState(false)

    const orderAction = (order_id, url, action) => {
        const data_to_send = {
            action,
            order_id,
            user_id: tg?.initDataUnsafe?.user?.id
        }
        setSendData(data_to_send)
        setTargetLink(url)
    }

    const onSendData = async () => {
        setIsShowAlert(false)
        await PractiseAPI.send_data_to_bot(sendData).then(result => {
            const link = result.data
            // tg.MainButton.hide()
            setObj({...obj, link, user_tg_id: tg?.initDataUnsafe?.user?.id})
            tg?.openInvoice(link)
        }).catch(error => {
            console.log(error)
        })
    }

    const onClosedInvoice = (result) => {
        setObj({...obj, tg_id: tg?.initDataUnsafe?.user?.id})
        setSendData({action: -1, user_id: -1, order_id: -1})
        const {url, status} = result
        setMsg(`Ваш платеж завершился со статусом: ${status}`)
        setSeverity("info")
        setIsShowAlert(true)
        switch (status) {
            case "paid":
                setIsShowContent(true)
                setNeedRefreshPractise(true)
                setNeedRefreshOnline(true)
                break
            case "cancelled":
                setMsg("Платеж был отменен пользователем")
                setSeverity("warning")
                setIsShowAlert(true)
                break
            case "failed":
                setMsg("Платеж не завершился успешно")
                setSeverity("error")
                setIsShowAlert(true)
                break
            case "pending":
                setMsg("Платеж пока не обработан сервером, переходите в наш бот, чтобы увидеть статус")
                setSeverity("warning")
                setIsShowAlert(true)
                break
        }
    }

    useEffect(() => {
        const tg = window.Telegram?.WebApp
        // console.log("Telegram:", window.Telegram)
        if (tg) {
            tg.ready()
            tg.expand()
            tg.onEvent('mainButtonClicked', onSendData)
            tg.onEvent('invoiceClosed', onClosedInvoice)
        }
        setTg(tg)

        return () => {
            tg?.offEvent('mainButtonClicked', onSendData)
            tg?.offEvent('invoiceClosed', onClosedInvoice)
        }
    }, [])

    useEffect(() => {
        const mainButton = tg?.MainButton
        if (sendData.order_id > 0) {
            if (mainButton) {
                mainButton.onClick(onSendData)
                mainButton.text = 'ПЕРЕЙТИ К ОПЛАТЕ'
                mainButton.show()
            }
        } else {
            if (mainButton)
                mainButton.hide()
        }
    }, [sendData])

    return (
        <>
            <AlertShowUrl tg={tg} open={isShowContent} setOpen={setIsShowContent} url={targetLink} />
            {isShowAlert &&
                <UniAlert severity={severity}>
                    {msg}
                </UniAlert>
            }
            <Box>
                <SectionIntro/>
                <SectionCarousel/>
                <SectionPractise setMsg={setMsg} setSeverity={setSeverity}
                                 setIsShowAlert={setIsShowAlert} tg={tg} orderAction={orderAction}
                                 needRefresh={needRefreshPractise} setNeedRefresh={setNeedRefreshPractise}
                />
                <SectionOnline setMsg={setMsg} setSeverity={setSeverity}
                               setIsShowAlert={setIsShowAlert} tg={tg} orderAction={orderAction}
                               needRefresh={needRefreshOnline} setNeedRefresh={setNeedRefreshOnline}
                />
                <SectionFooter tg={tg} />
            </Box>
        </>
    );
}
