import WebpackDevServer, { Configuration } from "webpack-dev-server";
import Webpack from "webpack";
import webpackConfig from "./webpack/webpack.config";

export function startDevServer() {
  const port = 4567;
  const devServerOptions: Configuration = {
    open: true
  };
  console.log("Startin dev server.");
  const compiler = Webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, devServerOptions);
  devServer.listen(port, () => {
    console.log("Listening at:", port);
  });
}
