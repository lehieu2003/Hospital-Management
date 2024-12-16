import axios from 'axios';
import queryString from 'query-string';
export function initAxios() {
    axios.defaults.paramsSerializer = (params) => {
        return queryString.stringify(params, { arrayFormat: 'none' });
    };
}
