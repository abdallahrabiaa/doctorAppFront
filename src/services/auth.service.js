import instance from 'utils/axios';
import config from 'utils/config'
import notification from 'utils/notification';
import errorHandler from 'utils/error'
import axios from 'axios';
class AuthService {

    validateEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    async signIn(email, password, type, timeout = 1000) {
        try {
            const response = await instance
                .post(config.AUTH_PATH + "/sign-in", {
                    email,
                    password
                    , type
                });
            const { data } = response;
            notification('successful login', data.message, 'success');
            const { results } = data;
            const [token, user] = results;
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("type", JSON.stringify(type));

            setTimeout(() => window.location.reload(), timeout)
            return true;
        }
        catch (err) {
            return errorHandler(err)
        }

    }

    async signUp(email, password, name, type = "patient") {
        try {
            const response = await instance
                .post(config.AUTH_PATH + "/sign-up", {
                    email,
                    password,
                    name,
                    type
                });
            const { data } = response;
            notification('successful signup', data.message, 'success');

            return true;
        }
        catch (err) {
            if (err.response) {
                const { data } = err.response;
                if (data)
                    notification('error', data.message, 'warning');
            }

            else
                notification('error', err.message, 'danger');
            return false;

        }

    }

    async forgotPassword(email) {

        try {
            const response = await instance
                .post(config.AUTH_PATH + "/password", {
                    email,
                });
            const { data } = response;
            notification('successful send !', data.message, 'success');
            return true;
        }
        catch (err) {
            if (err.response) {
                const { data } = err.response;
                if (data)
                    notification('error', data.message, 'warning');
            }

            else
                notification('error', err.message, 'danger');

            return false;
        }

    }
    async resetPassword(password, token) {

        try {
            const response = await instance
                .patch(config.AUTH_PATH + "/password", {
                    password: password,
                    token: token
                });
            const { data } = response;
            notification('successful send !', data.message, 'success');
            return true;
        }
        catch (err) {
            if (err.response) {
                const { data } = err.response;
                if (data)
                    notification('error', data.message, 'warning');
            }

            else
                notification('error', err.message, 'danger');

            return false;
        }

    }

    logout(timeout = 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("type");

        setTimeout(() => window.location.reload(), timeout)

        notification('successful logout', "successfull logout from server");


    }




    isLogin = () => {
        if (localStorage.getItem('token')) {
            return true;
        }

        return false;
    }

    getCurrentUser = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user)
            return user;
        return false;
    }
    getType = () => {
        const type = JSON.parse(localStorage.getItem('type'));
        if (type)
            return type;
        return false;
    }


}

export default new AuthService();