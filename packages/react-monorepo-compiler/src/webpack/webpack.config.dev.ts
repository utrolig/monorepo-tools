import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import { htmlWebpackPlugin, forkTsCheckerPlugin } from "./plugins";

const extendedConfig: Configuration = {
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [htmlWebpackPlugin, forkTsCheckerPlugin]
};

export default merge(baseConfig, extendedConfig);
