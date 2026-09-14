import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendNotification = async({to, subject, message }) =>{

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [to],
        subject,
        text: message
    });

    if(error){
        throw new Error(error.message);
    }

    return data;
};

export { sendNotification };
