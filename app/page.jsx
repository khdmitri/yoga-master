import dynamic from "next/dynamic";

function SellIcon() {
    return null;
}

export default function Home() {
    const SectionPractise = dynamic(() => import('./_components/section_practise'), { ssr: false })
    return (
        <SectionPractise />
    );
}
