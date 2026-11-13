import { AUTH_URL } from "./jobs"


export const checkoutVerify = async(sessionId: string) => {
    const res = await fetch(`${AUTH_URL}/payments/checkout-verify`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({sessionId})
    })

    return res.json();
}