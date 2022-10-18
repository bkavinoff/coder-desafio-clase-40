import { enviroment } from '../utils/config.js';
import twilio from "twilio";

const smsClient = twilio(enviroment.ACCOUNTSID, enviroment.AUTHTOKEN_TWILIO)

const smsOptions = {
    body: "",
    from: enviroment.ADMIN_SMS_NUMBER,
    to: "+54"
}

export { smsClient, smsOptions }