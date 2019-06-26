import WebpackDevServer from "webpack-dev-server";
import devServerOptions from "./webpack/webpack.config.devserver";
import Webpack from "webpack";
import webpackConfig from "./webpack/webpack.config.dev";
import { appPkgJson } from "./paths";
const {
  choosePort,
  createCompiler,
  prepareUrls
} = require("react-dev-utils/WebpackDevServerUtils");

function onDevServerStart(err: any) {
  console.log("Starting server...");

  if (err) {
    console.error(err);
  }
}

export async function startDevServer() {
  const defaultPort = 3000;
  const host = "0.0.0.0";
  const port = await choosePort(host, defaultPort);
  const devSocket = {
    warnings: (warnings: any) =>
      (devServer as any).sockWrite(
        (devServer as any).sockets,
        "warnings",
        warnings
      ),
    errors: (errors: any) =>
      (devServer as any).sockWrite((devServer as any).sockets, "errors", errors)
  };
  const appName = require(appPkgJson).name;
  const urls = prepareUrls("http", host, port);
  const compiler = createCompiler({
    appName,
    config: webpackConfig,
    devSocket,
    urls,
    useYarn: true,
    useTypeScript: true,
    webpack: Webpack
  });
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(port, host, onDevServerStart);
}
