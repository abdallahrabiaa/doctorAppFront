import notification from 'utils/notification'
function errorHandler(err) {
    if (err.response) {
        const { data } = err.response;
        if (data)
            notification('error', data.message || "erorr", 'warning');
    }

    else {

        notification('error', err.message || "erorr", 'danger');

    }
    return false;

}
export default errorHandler;