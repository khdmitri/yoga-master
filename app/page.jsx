import dynamic from "next/dynamic";
import "./page.module.css";
import SectionIntro from "./_components/section_intro";
import SectionCarousel from "./_components/section_carousel";
import Box from "@mui/material/Box";

function SellIcon() {
    return null;
}

export default function Home() {
    const SectionPractise = dynamic(() => import('./_components/section_practise'), {ssr: false})
    return (
        <>
            <Box>
                <SectionIntro/>
                <SectionCarousel/>
                <SectionPractise/>
            </Box>
        </>
    );
}
