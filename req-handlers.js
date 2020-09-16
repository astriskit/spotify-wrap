const {
  newReleaseSpotFlow,
  validateLogin,
  getLocalNewReleases,
} = require("./utils");

module.exports.handleFetchNewReleases = async (req, res) => {
  try {
    const { authorization: auth } = req.headers;
    if (!auth) return res.status(403).send({ error: "Authorization missing" });
    const [_, digest] = auth.split(" ");

    if (!digest)
      return res
        .status(403)
        .send({ error: "Username and/or password missing" });

    const isValidLogin = validateLogin(digest);
    if (!isValidLogin)
      return res
        .status(403)
        .send({ error: "Invalid username and/or password" });

    const releases = await newReleaseSpotFlow();
    return res.json(releases);
  } catch (err) {
    console.error(`Error/handleFetchNewReleases/\n ${err.message}`);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports.handleGetReleases = async (_, res) => {
  try {
    const releases = await getLocalNewReleases();
    return res.json(releases);
  } catch (err) {
    console.error(`Error/handleGetReleases/\n ${err.message}`);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
