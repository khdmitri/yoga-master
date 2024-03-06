'use client'
import React from 'react';
import {Grid} from "@mui/material";
import Button from "@mui/material/Button";
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import Box from "@mui/material/Box";
import {redirect} from "next/navigation";

const SectionFooter = (props) => {
    const {tg} = props
    const redirect_to = (url) => {
        if (tg && tg.initDataUnsafe?.user?.id)
            tg.openLink(url)
        else
            window.location.assign(url)
    }

    return (
        <section className="section_footer" id="FOOTER_ID">
            <Box className="section-label-box" id="courses" display="flex" justifyContent="center"
                 sx={{paddingTop: 3, paddingBottom: 3}}>
                <Grid container spacing={2} display="flex" justifyContent="center">
                    <Grid item xs={12} md={6} lg={3} display="flex" justifyContent="center">
                        <Button variant="outlined" startIcon={<YouTubeIcon/>} sx={{color: "red", borderColor: "red"}}
                                onClick={() => redirect_to("https://www.youtube.com/@mindmaster6776")}
                        >
                            Youtube
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} display="flex" justifyContent="center">
                        <Button variant="outlined" startIcon={<TelegramIcon/>}
                                onClick={() => redirect_to("https://t.me/yoga_master_mind")}
                        >
                            Telegram-Канал
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} display="flex" justifyContent="center">
                        <Button variant="outlined" startIcon={<TelegramIcon/>}
                                onClick={() => redirect_to("https://t.me/yoga_master_mind_bot")}
                        >
                            Telegram-Бот
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </section>
    );
};

export default SectionFooter;