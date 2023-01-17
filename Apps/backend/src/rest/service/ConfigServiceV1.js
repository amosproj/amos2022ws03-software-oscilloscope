import fs from "fs";
import { PATH_PRESET } from "../../const.js";

/**
 * Implementation of config service
 * @namespace ConfigService
 */
const configService = {
  /**
   * Get the current channel configuration if there is one.
   * @returns ChannelConfig as json or undefined
   * @memberof ConfigService
   * @function
   **/
  getConfigs() {
    try {
      var files_ = [];
      var files = fs.readdirSync(PATH_PRESET);
      for (var i in files) {
        var name = files[i].replace(".json", "");
        files_.push(name);
      }
      return files_;
    } catch (error) {
      return [];
    }
  },
  /**
   * Get channel configuration by id.
   * @param {string} id String of preset name
   * @returns ChannelConfig as json or undefined
   * @memberof ConfigService
   * @function
   **/
  getConfigById(id) {
    try {
      var file = `${PATH_PRESET}/${id}.json`;
      var raw = fs.readFileSync(file);
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
   * @param {string} id String of preset name
   * @returns ChannelConfig equal to input
   * @memberof ConfigService
   * @function
   **/
  postConfig(input, id) {
    let filename = `${PATH_PRESET}/${id}.json`;
    fs.writeFileSync(filename, JSON.stringify(input));
    return input;
  },
};

export default configService;
