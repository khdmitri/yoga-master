"use client"
import React, {useEffect, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Alert, List, ListSubheader, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import moment from "moment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import {WEBAPP_ACTIONS} from "../../../lib/constants";
import PractiseAPI from "../../../lib/practise";
import {useRouter} from "next/navigation";

const URL = "https://t.me/yoga_master_mind_bot"

const OnlineList = (props) => {
    const {lessons, invoice, orderAction, user_id} = props
    const [updatedLessons, setUpdatedLessons] = useState(lessons)
    const router = useRouter()

    useEffect(() => {
        const update_lessons = async () => {
            const updated_lessons = await Promise.all(lessons.map(async (lesson) => {
                const group = await PractiseAPI.is_group_member({
                    tg_id: user_id,
                    media_id: lesson.id
                })
                lesson.is_member = !!group.data
                return lesson
            }))
        }
        setUpdatedLessons(update_lessons())
    }, [])

    const btnJoinClicked = async (lesson) => {
        if (lesson.is_free) {
            // console.log("Lesson is free. Join user to lesson")
            await PractiseAPI.join_group_online({
                tg_id: user_id,
                media_id: lesson.id
            })
        } else if (invoice) {
            // console.log("Abonement is valid. Join user to lesson using abonement")
            await PractiseAPI.join_group_online({
                tg_id: user_id,
                media_id: lesson.id
            })
        } else {
            // console.log("Buy lesson")
            orderAction(lesson.id, URL, WEBAPP_ACTIONS.buy_online)
        }
    }

    const btnLeftClicked = async (lesson) => {
        await PractiseAPI.leave_group({
            tg_id: user_id,
            media_id: lesson.id
        }).then(res => {
            router.refresh()
        })
    }

    return (
        <Box>
            {updatedLessons && Array.isArray(updatedLessons) &&
                <Box>
                    {updatedLessons.map(lesson => {
                        return (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon/>}
                                    aria-controls="panel1-content"
                                    id={"lesson-list-" + lesson.id.toString()}
                                >
                                    <Typography gutterBottom variant="h6" component="div">
                                        {moment(lesson.action_date).format('DD.MM.YYYY hh:ss')} (Мск) - {lesson.title}
                                    </Typography>
                                    {lesson.is_member &&
                                        <Alert variant="outlined" severity="success">
                                            Вы записаны
                                        </Alert>
                                    }
                                    {lesson.is_member ?
                                        <Button onClick={() => btnLeftClicked(lesson)} variant="contained"
                                                size="medium">
                                            Отписаться
                                        </Button>
                                        :
                                        <Button onClick={() => btnJoinClicked(lesson)} variant="contained"
                                                size="medium">
                                            {lesson.is_free ?
                                                <span>Записаться бесплатно</span>
                                                :
                                                invoice ?
                                                    <span>Записаться (абонемент {invoice.ticket_count})</span>
                                                    : <span>Записаться ({lesson.cost} руб.)</span>
                                            }
                                        </Button>
                                    }
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">
                                        {lesson.description}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </Box>
            }
        </Box>
    );
};

export default OnlineList;