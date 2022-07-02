import { Store } from 'react-notifications-component';
export default function notification(title, message, type = 'default', duration = 3000) {
    return Store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: message.length * 30 || duration,
            onScreen: true
        }
    });
}