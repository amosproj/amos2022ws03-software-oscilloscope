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
    var preset = configService.getConfigById(req.params.id);
    if (preset === undefined) {
      res.status(404).json("Not found");
    } else {
      res.status(200).json(preset);
    }
  }

  function POST(req, res, next) {
    res
      .status(501)
      .json("not implemented. Available as POST on /config?id=<id>");
  }

  return operations;
}
