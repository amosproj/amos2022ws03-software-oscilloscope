export default function (configService) {
  let operations = {
    GET,
    POST,
  };

  function GET(req, res, next) {
    var preset = configService.getConfig();

    if (preset === undefined) res.status(404).json();
    else res.status(200).json(preset);
  }

  function POST(req, res, next) {
    res.status(200).json(configService.postConfig(req.body));
  }

  return operations;
}
