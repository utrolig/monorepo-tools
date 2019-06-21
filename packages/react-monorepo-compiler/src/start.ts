import WebpackDevServer from "webpack-dev-server";
import devServerOptions from "./webpack/webpack.config.devserver";
import Webpack from "webpack";
import webpackConfig from "./webpack/webpack.config.dev";

export function startDevServer() {
  const port = 3000;
  console.log("Starting dev server on port", port);
  const compiler = Webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(port, () => {
    console.log("Listening at:", port);
  });
}
