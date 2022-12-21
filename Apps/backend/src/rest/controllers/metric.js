/**
 * @namespace MetricsController
 */

/**
 * REST Controller for the /config endpoint
 * @param {MetricService} metricService Service implementation of config endpoint
 * @returns Available operations [GET; POST]
 */
export default function (metricService) {
    let operations = {
      GET
    };

    /**
     * Handle a GET request
     *
     * @param {*} req request object
     * @param {*} res response object
     * @param {*} next
     * @returns |-
     *  - HTTP 200 & JSON object if there a valid channel config file
     *  - HTTP 404 If there is no channel config file
     * @memberof MetricController
     * @function
     */
    function GET(req, res, next) {
      var preset = configService.getConfig();

      if (preset === undefined) res.status(404).json();
      else res.status(200).json(preset);
    }
    /**
     * Handle a POST request
     * @param {*} req request object
     * @param {*} res response object
     * @param {*} next
     * @memberof ConfigController
     */
    function POST(req, res, next) {
      res.status(200).json(configService.postConfig(req.body));
    }

    return operations;
  }
