import instance from "utils/axios";
import config from '../utils/config'
import notification from 'utils/notification';
import errorHandler from 'utils/error'
class Model {

    constructor(model) {
        this.path = config.API_URL + config.API_PATH + "/" + model
    }
    getPath() {
        return this.path
    }
    async create(payload) {
        try {
            if (!payload) return notification('error', "must have payload", 'warning');
            const response = await instance.post(this.getPath(),
                payload
            )
            const { data } = response;
            notification('successful action !', data.message, 'success');
            return true;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
    async edit(payload, ID) {
        try {
            if (!payload) return notification('error', "must have payload", 'warning');
            const response = await instance.put(this.getPath() + "/" + ID,
                payload
            )
            const { data } = response;
            notification('successful action !', data.message, 'success');
            return true;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
    async delete(ID) {
        try {

            const response = await instance.delete(this.getPath() + "/" + ID)
            const { data } = response;
            notification('successful action !', data.message, 'success');
            return true;

        }
        catch (err) {
            return errorHandler(err)
        }
    }

    async get(query = "", populate = "", page = 1, filter = {}) {
        try {
            const field = Object.keys(filter)[0]
            const value = filter[field];
            const response = await instance.get(this.getPath() + `?q=${query}&populate=${populate}&page=${page}&field=${field}&value=${value}`)
            const { data } = response;
            return data;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
    async getOne(ID) {
        try {
            const response = await instance.get(this.getPath() + `/${ID}`);
            const { data } = response;
            return data;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
    async getStats() {
        try {
            const response = await instance.get(this.getPath() + `-stats`);
            const { data } = response;
            return data;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
    async Random(payload) {
        try {
            const response = await instance.post(this.getPath() + `-random`, payload);
            const { data } = response;
            return data;

        }
        catch (err) {
            return errorHandler(err)
        }
    }
}


const doctor = new Model('doctor');
const patient = new Model('patient');
const appointment = new Model('appointment');
const category = new Model('category');
const chat = new Model('chat');

console.log(doctor)
export default Model;
export {
    doctor,
    patient,
    appointment,
    category,
    chat
}