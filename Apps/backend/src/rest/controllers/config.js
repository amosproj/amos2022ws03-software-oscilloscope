/**
 * @namespace ConfigController
 */

/**
 * REST Controller for the /config endpoint
 * @param {ConfigService} configService Service implementation of config endpoint
 * @returns Available operations [GET; POST]
 */
export default function (configService) {
  let operations = {
    GET,
    POST,
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
   * @memberof ConfigController
   * @function
   */
  function GET(req, res, next) {
    var presets = configService.getConfigs();
    res.status(200).json(presets);
  }
  /**
   * Handle a POST request
   * @param {*} req request object
   * @param {*} res response object
   * @param {*} next
   * @memberof ConfigController
   */
  function POST(req, res, next) {
    res.status(200).json(configService.postConfig(req.body, req.query.id));
  }

  return operations;
}
