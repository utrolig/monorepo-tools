import WebpackDevServer from "webpack-dev-server";
import devServerOptions from "./webpack/webpack.config.devserver";
import Webpack from "webpack";
import webpackConfig from "./webpack/webpack.config.dev";
import { clearConsole, ensureProperClose } from "./util";
import chalk from "chalk";
import { stat } from "fs";

function onDevServerStart() {
  console.log("Starting server...");
}

const logTime = (
  startTime: number | undefined,
  endTime: number | undefined
) => {
  if (!endTime || !startTime) return;
  console.log(`Time elapsed: ${chalk.blue(`${endTime - startTime}`)}ms`);
};

const logSuccess = () => {
  console.log(chalk.cyan("Compiled successfully."));
};

const logServerInfo = (serverAddress: string) => {
  console.log(`Listening at ${chalk.red(serverAddress)}`);
};

function compilationError(stats: Webpack.Stats, serverAddress: string) {
  clearConsole();
  logServerInfo(serverAddress);
  console.log(stats.compilation.errors);
}

function compilationSuccess(stats: Webpack.Stats, serverAddress: string) {
  clearConsole();
  logServerInfo(serverAddress);
  logSuccess();
  logTime(stats.startTime, stats.endTime);
}

function logStartedCompilation() {
  console.log("Compiling...");
}

export function startDevServer() {
  const port = 3000;
  const host = "0.0.0.0";
  const serverAddress = `${host}:${port}`;
  const compiler = Webpack(webpackConfig);
  compiler.hooks.done.tap("test", stats => {
    if (stats.hasErrors()) {
      compilationError(stats, serverAddress);
    } else {
      compilationSuccess(stats, serverAddress);
    }
  });
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(port, host, onDevServerStart);
}
