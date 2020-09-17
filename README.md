# spotify-wrap

A deployable api-server which is a spotify wrapper for latest release resource;

# System-level components

- Api-server: Express based server for CRUD operations on database: Only read implemented.
- Database: Mongodb instance to store the latest release albums: Must be configured using the variables defined in `config.js`.
- Auto-fetcher: A cron process to fetch latest release from spotify @ [here](https://github.com/astriskit/spotify-wrap-cron)

# Instruction to run (common to both projects)

1. Create .env in the root of the project. Define the configurations using the variables defined in the `config.js`. Or optionally, that could be done using `config.js` file itself.
2. `npm install` to install dependencies.
3. `npm start` to run the express server or the cron in the other repo.
4. For api-server: Go to your browser to check for one of the two routes in the api-server (by default on localhost:3000) i.e. `api/v1/newReleases`, which gets you the data from the mongo-instance configured using the .env or config.js or commandline based environment variables corresponding to variables defined in the config.js.

## Live instance on [heroku](https://spotify-wrap.herokuapp.com/api/v1/newReleases).
Click to access new-releases data from the mongo-instance.

### Scope

There could be many improvements done in the implementation at system-level, coder's level, etc. And I'd like hear about these; if someone has an advice or rant or whatever - feel free to open an issue and write about it. And in the mean time I'll keep learning. Next might be dockerizing api-server.
