/**
 * Implementation of config service
 * @namespace ConfigService
 */
const metricService = {
    /**
     * Get the current channel configuration if there is one.
     * @returns ChannelConfig as json or undefined
     * @memberof ConfigService
     * @function
     **/
    getMetric() {
      try {
        var raw = fs.readFileSync(PATH_PRESET);
        var preset = JSON.parse(raw);
  
        return preset;
      } catch (error) {
        return undefined;
      }
    },
  
  };
  
  export default metricService;