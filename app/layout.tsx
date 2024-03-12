import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ResponsiveAppBar from "./_components/app_bar";
import {BottomNavigation, BottomNavigationAction, CssBaseline} from "@mui/material";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Авторская йога Марины Киселевой",
    description: "Авторские практики, online-уроки, хатха-йога, йога-нидра",
};

function RestoreIcon() {
    return null;
}

function FavoriteIcon() {
    return null;
}

function LocationOnIcon() {
    return null;
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <script src="https://telegram.org/js/telegram-web-app.js" async/>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-M2KFCP97FT"></script>
            {/*<script src="../lib/google" async/>*/}
            <script type="text/javascript" src="../lib/yandex" async/>
        </head>
        <CssBaseline/>
        <body className={inter.className}>
        <noscript>
            <div><img src="https://mc.yandex.ru/watch/96678041" className="yandexFrame" alt=""/></div>
        </noscript>
        <ResponsiveAppBar/>
        {children}
        </body>
        </html>
    );
}
