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
            <script src="../lib/google" async />
        </head>
        <CssBaseline/>
        <body className={inter.className}>
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5M9KN8PW"
                    height="0" width="0" className="googleFrame"></iframe>
        </noscript>
        <ResponsiveAppBar/>
        {children}
        </body>
        </html>
    );
}
