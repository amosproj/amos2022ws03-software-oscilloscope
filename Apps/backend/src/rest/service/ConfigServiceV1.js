import fs from "fs";
import { PATH_PRESET } from "../../const.js";

const configService = {
  /**
   * Get the current channel configuration if there is one.
   * @returns ChannelConfig as json or undefined
   **/
  getConfig() {
    try {
      var raw = fs.readFileSync(PATH_PRESET);
      var preset = JSON.parse(raw);

      return preset;
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Store a new configuration for channels. If there is already a existing configuration, it will be overwritten.
   *
   * body ChannelConfig Create a new configuration for channels
   * @param {JSON} input JSON formatted channel configuration
   * @returns ChannelConfig equal to input
   **/
  postConfig(input) {
    fs.writeFileSync(PATH_PRESET, JSON.stringify(input));
    return input;
  },
};

export default configService;
