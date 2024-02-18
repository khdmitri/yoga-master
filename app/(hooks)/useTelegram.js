export default function useTelegram() {
    let w = null
    if (typeof window !== "undefined") {
        // Client-side-only code
        w = window
    }
    const tg = w?.Telegram?.WebApp

    const onClose = () => {
        tg?.close()
    }

    const onToggleButton = () => {
        if (tg?.MainButton?.isVisible) {
            tg?.MainButton?.hide()
        } else {
            tg?.MainButton?.show()
        }
    }


    return {
        tg,
        onClose,
        onToggleButton,
        user: tg?.initDataUnsafe?.user,
    }
}