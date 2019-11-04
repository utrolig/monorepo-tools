import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import {
  envPlugin,
  htmlWebpackPlugin,
  forkTsCheckerPlugin,
  interpolateHtmlPlugin
} from "./plugins";
import { getEntryPoint, getMonacoEntryPoints } from "./utils";
import { srcFolder } from "./paths";

const extendedConfig: Configuration = {
  entry: {
    hotClient: require.resolve("react-dev-utils/webpackHotDevClient"),
    app: getEntryPoint(srcFolder),
    ...getMonacoEntryPoints(srcFolder)
  },
  output: {
    publicPath: "/"
  },
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [
    envPlugin,
    htmlWebpackPlugin,
    interpolateHtmlPlugin,
    forkTsCheckerPlugin
  ]
};

export default merge(baseConfig, extendedConfig);
