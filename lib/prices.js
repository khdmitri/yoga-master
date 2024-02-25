const discount = process.env.NEXT_PUBLIC_PRICE_DISCOUNT

export default function get_practise_price(practise) {
    console.log("PRACTISE:", practise)
    let total = 0
    const price = practise.medias.reduce((accumulator, media) => {
        return accumulator + media.cost
    }, total)
    if (price > 0) {
        return Math.round(price - price/100*discount)
    }
    return price
}