import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import {
  envPlugin,
  htmlWebpackPlugin,
  forkTsCheckerPlugin,
  interpolateHtmlPlugin
} from "./plugins";

const extendedConfig: Configuration = {
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
