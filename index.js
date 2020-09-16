const dotEnv = require("dotenv");
dotEnv.config();

const { validateConfig } = require("./utils");

const main = () => {
  const { SPORTIFYWRAP_APP_PORT: port } = require("./config");
  const {
    handleFetchNewReleases,
    handleGetReleases,
  } = require("./req-handlers");

  const express = require("express");
  const app = express();

  app.get("/api/v1/newReleases", handleGetReleases);
  app.post("/api/v1/fetchNewReleases", handleFetchNewReleases);

  app.listen(port, () => {
    console.info(`API Server: listening on ${port}`);
  });
};

if (require.main === module) {
  if (validateConfig()) {
    main();
  } else {
    console.error("Error: Missing configurations!");
  }
}
