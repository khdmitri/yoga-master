import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_YOGA_BASE_URL
})
instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*"
instance.defaults.headers.get["Content-Type"] = "application/json"
instance.defaults.headers.post["Content-Type"] = "application/json"

export default class PractiseAPI {
    static async get_practises() {
        return await instance.get("practises")
    }

    static async get_lessons() {
        return await instance.get("practises/online")
    }

    static async send_data_to_bot(data) {
        return await instance.post("practises/webapp_data", data)
    }

    static async if_practise_been_paid(data) {
        // console.log("Send data:", data)
        return await instance.post("practises/get_paid_invoice", data)
    }

    static async get_paid_invoice_online(data) {
        // console.log("Send data:", data)
        return await instance.post("practises/get_paid_invoice_online", data)
    }

    static async join_group_online(data) {
        // console.log("Send data:", data)
        return await instance.post("practises/join_group_online", data)
    }

    static async is_group_member(data) {
        // console.log("Send data:", data)
        return await instance.post("practises/is_group_member", data)
    }

    static async leave_group(data) {
        // console.log("Send data:", data)
        return await instance.post("practises/leave_group_online", data)
    }
}