import React from 'react';
import Box from "@mui/material/Box";
import UniAlert from "./alert/alert";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Typography from "@mui/material/Typography";

const SectionIntro = () => {
    return (
        <section className="section_intro" id="INTRO_ID">
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{paddingTop: 3, paddingBottom: 2}}
                     flexDirection="column">
                    <Avatar src="/images/yoga/yoga_avatar_black.png" sx={{width: 127, height: 128,}}/>
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