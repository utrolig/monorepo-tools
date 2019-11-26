import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import {
  envPlugin,
  htmlWebpackPlugin,
  forkTsCheckerPlugin,
  interpolateHtmlPlugin
} from "./plugins";
import { getEntryPoint } from "./utils";
import { srcFolder } from "./paths";

const extendedConfig: Configuration = {
  entry: [
    require.resolve("react-dev-utils/webpackHotDevClient"),
    getEntryPoint(srcFolder)
  ],
  output: {
    publicPath: "/"
  },
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  plugins: [
    envPlugin,
    htmlWebpackPlugin,
    interpolateHtmlPlugin,
    forkTsCheckerPlugin
  ]
};

export default merge(baseConfig, extendedConfig);
