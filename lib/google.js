function googleAnalytics () {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'G-M2KFCP97FT');
}
googleAnalytics();