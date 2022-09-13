const chalk = require("chalk");
const { fork } = require("child_process");
const path = require("path");
const chokidar = require("chokidar");

const state = {
  child: null,
  error: false,
  indexFile: null,
  watchdir: null,
  boot: null,
};

const logError = (error) => {
  state.error = true;
  console.log(chalk.red(error.message));
  if (error.stack) console.log(chalk.red(error.stack));
};

process.on("uncaughtException", (error) => {
  logError(error);
});

const start = () => {
  return new Promise((resolve, reject) => {
    if (state.child) state.child.kill();

    state.child = fork(path.join(__dirname, "child.js"));

    state.child.on("message", (message) => {
      if (message.topic === "uncaughtException") {
        logError(message.error);
      }
    });

    state.child.on("error", (error) => {
      logError(error);
    });

    state.child.send({
      topic: "init",
      options: {
        watchdir: state.watchdir,
        indexFile: state.indexFile,
      },
    });
    state.child.send({ topic: "start" });

    resolve();
  });
};

const restart = () => {
  if (!state.error) {
    state.child.send({ topic: "restart" });
    return;
  }
  console.log(chalk.green("restarting proccess due to error"));
  start()
    .then(() => {
      state.error = false;
    })
    .catch(logError);
};

const watchFiles = () => {
  chokidar
    .watch(path.join(process.cwd(), state.watchdir))
    .on("all", (event, at) => {
      if (event === "change") {
        console.log(chalk.green("change at ", at.replace(process.cwd(), "")));
        restart();
      }
    });
};

const boot = (args, options) => {
  console.log(chalk.green("nodeeye started watching..."));
  state.indexFile = args;
  state.watchdir = options.watchdir;
  start().then(() => {
    watchFiles();
  });
};

module.exports = boot;
