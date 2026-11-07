import { message } from "antd"

window.toast = (msg, type) => {
    message[type](msg)
}

window.apiURL = 'https://ahsan-todos-server.vercel.app' 