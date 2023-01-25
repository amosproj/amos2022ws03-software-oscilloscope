import axios from "axios";
import { REST_ENDPOINT_CONFIG } from "../const";
import {
  ERR_MSG_COULD_NOT_RETRIEVE_CHANNEL_CONFIG,
  ERR_MSG_COULD_NOT_STORE_CHANNEL_CONFIG,
} from "../labels";

export function getAllChannelConfig() {
  var response = axios
    .get(REST_ENDPOINT_CONFIG, {
      headers: {
        api_key: btoa(import.meta.env.VITE_REST_API_KEY),
        "content-type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch(function () {
      console.error(ERR_MSG_COULD_NOT_RETRIEVE_CHANNEL_CONFIG);
    });
  return response;
}

export function getChannelConfig(presetName) {
  var response = axios
    .get(`${REST_ENDPOINT_CONFIG}/${presetName}`, {
      headers: {
        api_key: btoa(import.meta.env.VITE_REST_API_KEY),
        "content-type": "application/json",
      },
    })
    .then((response) => response.data)
    .catch(function (error) {
      console.error(ERR_MSG_COULD_NOT_RETRIEVE_CHANNEL_CONFIG);
      console.error(error);
    });
  return response;
}

export function postChannelConfig(data, presetName) {
  var body = {
    channels: data,
  };
  var response = axios
    .post(REST_ENDPOINT_CONFIG, body, {
      headers: {
        api_key: btoa(import.meta.env.VITE_REST_API_KEY),
        "content-type": "application/json",
      },
      params: {
        id: presetName,
      },
    })
    .then((response) => response.data)
    .catch(function (error) {
      console.log(ERR_MSG_COULD_NOT_STORE_CHANNEL_CONFIG);
      console.error(error);
    });

  return response;
}
