import axios from 'axios'
import { REST_ENDPOINT_CONFIG } from '../const'
import { ERR_MSG_COULD_NOT_RETRIEVE_CHANNEL_CONFIG, ERR_MSG_COULD_NOT_STORE_CHANNEL_CONFIG } from '../labels'

export function getChannelConfig() {
    var response = axios.get(
        REST_ENDPOINT_CONFIG,
        {
            headers: {
                "api_key": "sosci",
                "content-type": "application/json"
            }
        }
    ).then( response => response.data
    ).catch(function (error) {
        console.error(ERR_MSG_COULD_NOT_RETRIEVE_CHANNEL_CONFIG)
    })
    return response
}

export function postChannelConfig(data) {

    var body = {
        channels: data
    }
    var response = axios.post(
        REST_ENDPOINT_CONFIG,
        body,
        {
            headers: {
                "api_key": "sosci",
                "content-type": "application/json"
            }
        }
    ).then(response => response.data
    ).catch(function (error) {
        console.log(ERR_MSG_COULD_NOT_STORE_CHANNEL_CONFIG)
    });
    
    return response;
}