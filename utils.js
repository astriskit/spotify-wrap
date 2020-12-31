const config = require("./config");
const axios = require("axios");

const getToken = () => {
  const {
    SPOTIFYWRAP_SPOTIFY_CLIENT_ID,
    SPOTIFYWRAP_SPOTIFY_CLIENT_SECRET,
  } = config;

  const qs = require("qs");

  const URI = "https://accounts.spotify.com/api/token";

  return axios.post(
    URI,
    qs.stringify({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: SPOTIFYWRAP_SPOTIFY_CLIENT_ID,
        password: SPOTIFYWRAP_SPOTIFY_CLIENT_SECRET,
      },
    }
  );
};

const getNewReleases = (token) => {
  const URI = `https://api.spotify.com/v1/browse/new-releases?offset=0&limit=50`;
  // get top 50
  return axios.get(URI, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const validateConfig = () => {
  let allValidated = true;
  for (const key in config) {
    if (!config[key]) {
      allValidated = false;
    }
  }
  return allValidated;
};

const validateLogin = (digest) => {
  try {
    const { SPOTIFYWRAP_API_USER: u, SPOTIFYWRAP_API_PASSWORD: p } = config;
    const [username, password] = btoa(digest).split(":");
    if (u === username && p === password) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const newReleaseSpotFlow = async () => {
  const {
    data: { access_token: token },
  } = await getToken();
  const {
    data: {
      albums: { items },
    },
  } = await getNewReleases(token);
  return items;
};

const getLocalNewReleases = async () => {
  try {
    const {
      SPOTIFYWRAP_DB_USER,
      SPOTIFYWRAP_DB_PASSWORD,
      SPOTIFYWRAP_DB_URI,
      SPOTIFYWRAP_DB_NAME,
      SPOTIFYWRAP_DB_COLLECTION,
    } = config;
    const { MongoClient } = require("mongodb");
    const uri = `mongodb+srv://${SPOTIFYWRAP_DB_USER}:${SPOTIFYWRAP_DB_PASSWORD}@${SPOTIFYWRAP_DB_URI}/${SPOTIFYWRAP_DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = await client.db(SPOTIFYWRAP_DB_NAME);
    const cls = await db.collections();
    let collectionFound = false;
    for (const cl of cls) {
      if (cl.collectionName === SPOTIFYWRAP_DB_COLLECTION) {
        collectionFound = true;
      }
    }
    if (!collectionFound) {
      await db.createCollection(SPOTIFYWRAP_DB_COLLECTION);
    }
    const releases = await db.collection(SPOTIFYWRAP_DB_COLLECTION);
    const cursor = await releases.find();
    const arr = await cursor.toArray();
    await client.close();
    return arr;
  } catch (err) {
    throw err;
  }
};

const btoa = (str) => Buffer.from(str, "base64").toString();
const atob = (str) => Buffer.from(str).toString("base64");

module.exports = {
  getNewReleases,
  getToken,
  validateConfig,
  newReleaseSpotFlow,
  validateLogin,
  getLocalNewReleases,
  btoa,
  atob,
};
