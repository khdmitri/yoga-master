import React from 'react';
import Box from "@mui/material/Box";
import UniAlert from "./alert/alert";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/navigation";
import Link from "next/link";

const URL = "https://t.me/yoga_master_mind"

const SectionIntro = (props) => {
    const {tg} = props
    const router = useRouter()
    const redirect_to_channel = () => {
        if (tg)
            tg.openTelegramLink(URL)
        else
            router.push(URL)
    }

    return (
        <section className="section_intro" id="INTRO_ID">
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{paddingTop: 3, paddingBottom: 2}}
                     flexDirection="column">
                    <Link href="#" onClick={redirect_to_channel}>
                        <Avatar src="/images/yoga/yoga_avatar_black.png" sx={{width: 127, height: 128,}}/>
                    </Link>
                    {/*<Image src="/labels/intro_label.png" alt="Авторская йога Марины Киселевой" width={420} height={120} />*/}
                    <Box>
                        <Typography variant="h5" color="#8B4513"><strong>АВТОРСКАЯ ЙОГА</strong></Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" color="#8B4513"><strong>МАРИНЫ КИСЕЛЕВОЙ</strong></Typography>
                    </Box>
                </Box>
            </Container>
        </section>
    );
};

export default SectionIntro;