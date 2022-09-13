const chalk = require("chalk");
const path = require("path");

const state = {
  server: null,
  sockets: [],
  indexFile: null,
  watchdir: null,
};

process.on("uncaughtException", (error) => {
  process.send({
    topic: "uncaughtException",
    error: { message: error.message },
  });
});

const init = (options) => {
  state.indexFile = options.indexFile;
  state.watchdir = options.watchdir;
};

const startServer = () => {
  const module = require(path.join(process.cwd(), state.indexFile));
  state.server = module;

  if (typeof module === "object") {
    state.server = module.default;
  }

  state.server.on("connection", (socket) => {
    state.sockets.push(socket);
  });
};

const restartServer = () => {
  Object.keys(require.cache).forEach((id) => {
    if (id.startsWith(path.join(process.cwd(), state.watchdir))) {
      delete require.cache[id];
    }
  });
  state.sockets.forEach((socket, i) => {
    if (!socket.destroyed) socket.destroy();
  });
  state.sockets = [];

  if (!state.server.address()) {
    startServer();
    return;
  }

  state.server.close(() => {
    console.log(chalk.green("restarting the server due to change..."));
    startServer();
  });
};
process.on("message", ({ topic, options }) => {
  if (topic === "init") init(options);
  if (topic === "start") startServer();
  if (topic === "restart") restartServer();
});
